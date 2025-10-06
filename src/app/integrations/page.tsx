'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Cloud, FileText, FolderOpen, Instagram, Store } from 'lucide-react';
import { Integration } from '@/types';

export default function IntegrationsPage() {
  const { currentUser } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'shopify' | 'squarespace' | 'woocommerce' | 'bigcommerce' | 'google-drive' | 'google-docs' | 'box' | 'dropbox' | 'instagram-shop' | 'tiktok-shop' | 'pinterest-shop' | 'etsy' | null>(null);
  const [connectionForm, setConnectionForm] = useState({
    storeName: '',
    storeUrl: '',
    apiKey: '',
    folderName: '',
  });

  const ecommercePlatforms = [
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Sync your products to your Shopify store',
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'bg-green-100 text-green-600',
      features: ['Auto-sync products', 'Inventory management', 'Order tracking'],
      category: 'ecommerce',
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      description: 'Integrate with your WordPress WooCommerce store',
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-600',
      features: ['WordPress integration', 'Product sync', 'Custom fields support'],
      category: 'ecommerce',
    },
    {
      id: 'bigcommerce',
      name: 'BigCommerce',
      description: 'Connect your BigCommerce enterprise store',
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      features: ['Enterprise features', 'Multi-channel selling', 'Advanced analytics'],
      category: 'ecommerce',
    },
    {
      id: 'squarespace',
      name: 'Squarespace',
      description: 'Connect your Squarespace commerce site',
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'bg-black text-white',
      features: ['Product sync', 'Image upload', 'Category mapping'],
      category: 'ecommerce',
    },
  ];

  const socialCommercePlatforms = [
    {
      id: 'instagram-shop',
      name: 'Instagram Shop',
      description: 'Sell directly on Instagram with product tags',
      icon: <Instagram className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white',
      features: ['Product tagging', 'Shopping posts', 'Instagram checkout'],
      category: 'social-commerce',
    },
    {
      id: 'tiktok-shop',
      name: 'TikTok Shop',
      description: 'Reach millions with TikTok Shop integration',
      icon: <Store className="h-8 w-8" />,
      color: 'bg-black text-white',
      features: ['Live shopping', 'Video commerce', 'Creator partnerships'],
      category: 'social-commerce',
    },
    {
      id: 'pinterest-shop',
      name: 'Pinterest Shop',
      description: 'Turn pins into purchases with Pinterest Shopping',
      icon: <Store className="h-8 w-8" />,
      color: 'bg-red-600 text-white',
      features: ['Product pins', 'Shopping ads', 'Catalog sync'],
      category: 'social-commerce',
    },
    {
      id: 'etsy',
      name: 'Etsy',
      description: 'Connect your Etsy shop for handmade products',
      icon: <Store className="h-8 w-8" />,
      color: 'bg-orange-600 text-white',
      features: ['Marketplace listing', 'Order management', 'Seller tools'],
      category: 'social-commerce',
    },
  ];

  const storagePlatforms = [
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Store and share product files in Google Drive',
      icon: <Cloud className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      features: ['File backup', 'Folder sync', 'Real-time collaboration'],
      category: 'storage',
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      description: 'Create and share product documentation',
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      features: ['Document creation', 'Template generation', 'Team collaboration'],
      category: 'storage',
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Sync files to your Dropbox account',
      icon: <FolderOpen className="h-8 w-8" />,
      color: 'bg-blue-500 text-white',
      features: ['Cloud storage', 'File sharing', 'Version control'],
      category: 'storage',
    },
    {
      id: 'box',
      name: 'Box',
      description: 'Enterprise file storage and collaboration',
      icon: <FolderOpen className="h-8 w-8" />,
      color: 'bg-blue-700 text-white',
      features: ['Secure storage', 'Workflow automation', 'Advanced sharing'],
      category: 'storage',
    },
  ];

  const allPlatforms = [...ecommercePlatforms, ...socialCommercePlatforms, ...storagePlatforms];

  useEffect(() => {
    // Load integrations from Firebase
    // For now, using mock data
    const mockIntegrations: Integration[] = [];
    setIntegrations(mockIntegrations);
  }, [currentUser]);

  const handleConnect = async () => {
    if (!selectedPlatform || !currentUser) return;

    // In production, this would:
    // 1. Initiate OAuth flow for the platform
    // 2. Store access tokens securely
    // 3. Create integration record in Firebase

    const isStoragePlatform = ['google-drive', 'google-docs', 'dropbox', 'box'].includes(selectedPlatform);

    const newIntegration: Integration = {
      id: `int_${Date.now()}`,
      userId: currentUser.uid,
      platform: selectedPlatform,
      storeName: connectionForm.storeName,
      storeUrl: connectionForm.storeUrl || undefined,
      accessToken: connectionForm.apiKey, // In production, this would be from OAuth
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(isStoragePlatform && connectionForm.folderName && {
        folderName: connectionForm.folderName,
        folderId: `folder_${Date.now()}`,
      }),
    };

    setIntegrations([...integrations, newIntegration]);
    setConnectDialogOpen(false);
    setConnectionForm({ storeName: '', storeUrl: '', apiKey: '', folderName: '' });
    setSelectedPlatform(null);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(integrations.filter(i => i.id !== integrationId));
  };

  const handleToggleActive = (integrationId: string) => {
    setIntegrations(integrations.map(i =>
      i.id === integrationId ? { ...i, isActive: !i.isActive, updatedAt: new Date() } : i
    ));
  };

  const handleSync = async (integrationId: string) => {
    setLoading(true);
    // Simulate sync
    setTimeout(() => {
      setIntegrations(integrations.map(i =>
        i.id === integrationId ? { ...i, lastSyncedAt: new Date() } : i
      ));
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-48">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Integrations</h1>
          <p className="text-gray-500 text-lg">Connect your store and sync products seamlessly</p>
        </div>

        {/* E-commerce Platforms */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">E-commerce Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ecommercePlatforms.map((platform) => {
              const connected = integrations.find(i => i.platform === platform.id);

              return (
                <Card key={platform.id} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{platform.name}</span>
                            {connected && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{platform.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {connected ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{connected.storeName}</p>
                            <p className="text-xs text-gray-500">{connected.storeUrl}</p>
                            {connected.lastSyncedAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                Last synced: {connected.lastSyncedAt.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <Switch
                            checked={connected.isActive}
                            onCheckedChange={() => handleToggleActive(connected.id)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSync(connected.id)}
                            disabled={loading}
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Sync Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(connected.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full bg-white hover:bg-pink-600 text-pink-600 hover:text-white border-pink-600 rounded-full transition-colors"
                        onClick={() => {
                          setSelectedPlatform(platform.id as any);
                          setConnectDialogOpen(true);
                        }}
                      >
                        Connect {platform.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Social Commerce Platforms */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Social Commerce & Marketplaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialCommercePlatforms.map((platform) => {
              const connected = integrations.find(i => i.platform === platform.id);

              return (
                <Card key={platform.id} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{platform.name}</span>
                            {connected && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{platform.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {connected ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{connected.storeName}</p>
                            <p className="text-xs text-gray-500">{connected.storeUrl}</p>
                            {connected.lastSyncedAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                Last synced: {connected.lastSyncedAt.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <Switch
                            checked={connected.isActive}
                            onCheckedChange={() => handleToggleActive(connected.id)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSync(connected.id)}
                            disabled={loading}
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Sync Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(connected.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full bg-white hover:bg-pink-600 text-pink-600 hover:text-white border-pink-600 rounded-full transition-colors"
                        onClick={() => {
                          setSelectedPlatform(platform.id as any);
                          setConnectDialogOpen(true);
                        }}
                      >
                        Connect {platform.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Cloud Storage Platforms */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cloud Storage & Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storagePlatforms.map((platform) => {
              const connected = integrations.find(i => i.platform === platform.id);

              return (
                <Card key={platform.id} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{platform.name}</span>
                            {connected && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{platform.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {connected ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{connected.storeName}</p>
                            <p className="text-xs text-gray-500">{connected.storeUrl}</p>
                            {connected.lastSyncedAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                Last synced: {connected.lastSyncedAt.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <Switch
                            checked={connected.isActive}
                            onCheckedChange={() => handleToggleActive(connected.id)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSync(connected.id)}
                            disabled={loading}
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Sync Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(connected.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full bg-white hover:bg-pink-600 text-pink-600 hover:text-white border-pink-600 rounded-full transition-colors"
                        onClick={() => {
                          setSelectedPlatform(platform.id as any);
                          setConnectDialogOpen(true);
                        }}
                      >
                        Connect {platform.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xl font-bold mb-2">
                  1
                </div>
                <CardTitle className="text-lg">Connect Your Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Securely connect your Shopify or Squarespace store using OAuth authentication.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xl font-bold mb-2">
                  2
                </div>
                <CardTitle className="text-lg">Select Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Choose which products from your library you want to sync to your store.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xl font-bold mb-2">
                  3
                </div>
                <CardTitle className="text-lg">Auto-Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Products are automatically synced with images, descriptions, and specifications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Connection Dialog */}
        <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Connect {allPlatforms.find(p => p.id === selectedPlatform)?.name}
              </DialogTitle>
              <DialogDescription>
                {['google-drive', 'google-docs', 'dropbox', 'box'].includes(selectedPlatform || '')
                  ? 'Enter your cloud storage details to connect'
                  : 'Enter your store details to connect'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="storeName">
                  {['google-drive', 'google-docs', 'dropbox', 'box'].includes(selectedPlatform || '')
                    ? 'Account Name'
                    : 'Store Name'}
                </Label>
                <Input
                  id="storeName"
                  value={connectionForm.storeName}
                  onChange={(e) => setConnectionForm({ ...connectionForm, storeName: e.target.value })}
                  placeholder={['google-drive', 'google-docs', 'dropbox', 'box'].includes(selectedPlatform || '')
                    ? 'My Account'
                    : 'My Store'}
                />
              </div>

              {['shopify', 'squarespace', 'woocommerce', 'bigcommerce', 'etsy', 'instagram-shop', 'tiktok-shop', 'pinterest-shop'].includes(selectedPlatform || '') ? (
                <div>
                  <Label htmlFor="storeUrl">
                    {selectedPlatform === 'instagram-shop' ? 'Instagram Handle' :
                     selectedPlatform === 'tiktok-shop' ? 'TikTok Username' :
                     selectedPlatform === 'pinterest-shop' ? 'Pinterest Username' :
                     selectedPlatform === 'etsy' ? 'Shop URL' :
                     'Store URL'}
                  </Label>
                  <Input
                    id="storeUrl"
                    value={connectionForm.storeUrl}
                    onChange={(e) => setConnectionForm({ ...connectionForm, storeUrl: e.target.value })}
                    placeholder={
                      selectedPlatform === 'shopify' ? 'mystore.myshopify.com' :
                      selectedPlatform === 'squarespace' ? 'mystore.squarespace.com' :
                      selectedPlatform === 'woocommerce' ? 'mystore.com' :
                      selectedPlatform === 'bigcommerce' ? 'mystore.mybigcommerce.com' :
                      selectedPlatform === 'instagram-shop' ? '@myshop' :
                      selectedPlatform === 'tiktok-shop' ? '@myshop' :
                      selectedPlatform === 'pinterest-shop' ? '@myshop' :
                      selectedPlatform === 'etsy' ? 'etsy.com/shop/myshop' :
                      ''
                    }
                  />
                </div>
              ) : null}

              {['google-drive', 'google-docs', 'dropbox', 'box'].includes(selectedPlatform || '') ? (
                <div>
                  <Label htmlFor="folderName">Folder Name (Optional)</Label>
                  <Input
                    id="folderName"
                    value={connectionForm.folderName}
                    onChange={(e) => setConnectionForm({ ...connectionForm, folderName: e.target.value })}
                    placeholder="Product Files"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Specify a folder to sync your product files
                  </p>
                </div>
              ) : null}

              <div>
                <Label htmlFor="apiKey">API Key / Access Token</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={connectionForm.apiKey}
                  onChange={(e) => setConnectionForm({ ...connectionForm, apiKey: e.target.value })}
                  placeholder="Enter your API key"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <a
                    href={
                      selectedPlatform === 'shopify' ? 'https://help.shopify.com/en/manual/apps/app-types/custom-apps' :
                      selectedPlatform === 'squarespace' ? 'https://support.squarespace.com/hc/en-us/articles/205812378-API-keys' :
                      selectedPlatform === 'woocommerce' ? 'https://woocommerce.com/document/woocommerce-rest-api/' :
                      selectedPlatform === 'bigcommerce' ? 'https://developer.bigcommerce.com/docs/start/authentication/api-accounts' :
                      selectedPlatform === 'google-drive' || selectedPlatform === 'google-docs' ? 'https://developers.google.com/identity/protocols/oauth2' :
                      selectedPlatform === 'dropbox' ? 'https://www.dropbox.com/developers/apps' :
                      selectedPlatform === 'box' ? 'https://developer.box.com/' :
                      selectedPlatform === 'instagram-shop' ? 'https://developers.facebook.com/docs/instagram-api' :
                      selectedPlatform === 'tiktok-shop' ? 'https://developers.tiktok.com/' :
                      selectedPlatform === 'pinterest-shop' ? 'https://developers.pinterest.com/' :
                      selectedPlatform === 'etsy' ? 'https://www.etsy.com/developers/documentation' :
                      '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline inline-flex items-center"
                  >
                    Learn how to get your API key <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={!connectionForm.storeName || !connectionForm.apiKey}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Connect
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
