import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Integration, Product, SyncLog } from '@/types';

/**
 * Shopify Product Sync
 */
export const syncProductToShopify = async (
  integration: Integration,
  product: Product
): Promise<{ success: boolean; externalProductId?: string; error?: string }> => {
  try {
    const shopifyProduct = {
      product: {
        title: product.name,
        body_html: product.description,
        vendor: 'Blossom',
        product_type: product.category,
        images: product.images.map(url => ({ src: url })),
        variants: [
          {
            price: '0.00', // Price should be set in Shopify
            inventory_management: 'shopify',
            inventory_quantity: 0,
          }
        ],
        metafields: [
          {
            namespace: 'blossom',
            key: 'product_id',
            value: product.id,
            type: 'single_line_text_field'
          },
          {
            namespace: 'blossom',
            key: 'specifications',
            value: JSON.stringify(product.specifications),
            type: 'json'
          }
        ]
      }
    };

    const response = await fetch(`https://${integration.storeUrl}/admin/api/2024-01/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': integration.accessToken,
      },
      body: JSON.stringify(shopifyProduct),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Shopify API error: ${error}`);
    }

    const data = await response.json();
    return {
      success: true,
      externalProductId: data.product.id.toString(),
    };
  } catch (error) {
    console.error('Error syncing to Shopify:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Squarespace Product Sync
 */
export const syncProductToSquarespace = async (
  integration: Integration,
  product: Product
): Promise<{ success: boolean; externalProductId?: string; error?: string }> => {
  try {
    const squarespaceProduct = {
      name: product.name,
      description: product.description,
      images: product.images.map(url => ({ url })),
      variants: [
        {
          pricing: {
            basePrice: {
              currency: 'USD',
              value: '0.00', // Price should be set in Squarespace
            },
          },
          attributes: {},
          stock: {
            quantity: 0,
          },
        }
      ],
      customFormData: {
        blossomProductId: product.id,
        specifications: JSON.stringify(product.specifications),
      },
    };

    const response = await fetch(`https://api.squarespace.com/1.0/commerce/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(squarespaceProduct),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Squarespace API error: ${error}`);
    }

    const data = await response.json();
    return {
      success: true,
      externalProductId: data.id,
    };
  } catch (error) {
    console.error('Error syncing to Squarespace:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Sync product to the appropriate platform
 */
export const syncProduct = async (
  integration: Integration,
  product: Product
): Promise<{ success: boolean; externalProductId?: string; error?: string }> => {
  if (integration.platform === 'shopify') {
    return syncProductToShopify(integration, product);
  } else if (integration.platform === 'squarespace') {
    return syncProductToSquarespace(integration, product);
  }

  return {
    success: false,
    error: 'Unsupported platform',
  };
};

/**
 * Bulk sync all products for an integration
 */
export const bulkSyncProducts = async (
  integration: Integration,
  products: Product[]
): Promise<SyncLog[]> => {
  const syncLogs: SyncLog[] = [];

  for (const product of products) {
    const result = await syncProduct(integration, product);

    const syncLog: SyncLog = {
      id: `sync_${Date.now()}_${product.id}`,
      integrationId: integration.id,
      productId: product.id,
      status: result.success ? 'success' : 'failed',
      externalProductId: result.externalProductId,
      errorMessage: result.error,
      syncedAt: new Date(),
    };

    syncLogs.push(syncLog);

    // Save sync log to Firebase
    try {
      await addDoc(collection(db, 'sync_logs'), syncLog);
    } catch (error) {
      console.error('Error saving sync log:', error);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Update integration's last synced time
  try {
    await updateDoc(doc(db, 'integrations', integration.id), {
      lastSyncedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating integration:', error);
  }

  return syncLogs;
};

/**
 * Get integrations for a user
 */
export const getUserIntegrations = async (userId: string): Promise<Integration[]> => {
  try {
    const integrationsRef = collection(db, 'integrations');
    const q = query(integrationsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const integrations: Integration[] = [];
    querySnapshot.forEach((doc) => {
      integrations.push({ id: doc.id, ...doc.data() } as Integration);
    });

    return integrations;
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return [];
  }
};

/**
 * Create a new integration
 */
export const createIntegration = async (integration: Omit<Integration, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'integrations'), integration);
    return docRef.id;
  } catch (error) {
    console.error('Error creating integration:', error);
    throw error;
  }
};

/**
 * Delete an integration
 */
export const deleteIntegration = async (integrationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'integrations', integrationId));
  } catch (error) {
    console.error('Error deleting integration:', error);
    throw error;
  }
};

/**
 * Get sync logs for an integration
 */
export const getSyncLogs = async (integrationId: string): Promise<SyncLog[]> => {
  try {
    const logsRef = collection(db, 'sync_logs');
    const q = query(logsRef, where('integrationId', '==', integrationId));
    const querySnapshot = await getDocs(q);

    const logs: SyncLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as SyncLog);
    });

    return logs.sort((a, b) => b.syncedAt.getTime() - a.syncedAt.getTime());
  } catch (error) {
    console.error('Error fetching sync logs:', error);
    return [];
  }
};
