import RoleBasedLayout from '@/Layouts/RoleBasedLayout';
import { User } from '@/types/roles';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { Lullaby, ProjectorContent } from '@/types/media';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { Switch } from '@/Components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { toast } from '@/Components/ui/use-toast';

interface MediaProps {
  auth: {
    user: User;
  };
  lullabies: Lullaby[];
  projectorContent: ProjectorContent[];
  device: {
    id: string;
    name: string;
    status: string;
    settings: {
      is_playing_music: boolean;
      current_lullaby?: string;
      volume: number;
      is_projector_on: boolean;
      current_content?: string;
    };
  };
}

const Media: React.FC<MediaProps> = ({ auth, lullabies, projectorContent, device }) => {
  const { user } = auth;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data, setData, post, processing } = useForm({
    audioFile: null as File | null,
    lullabyName: '',
    contentFile: null as File | null,
    contentName: '',
  });

  const handleLullabyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('audioFile', file);
    }
  };

  const handleContentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('contentFile', file);
    }
  };

  const uploadLullaby = () => {
    if (!data.audioFile || !data.lullabyName) {
      toast({
        title: 'Error',
        description: 'Please provide both a file and name for the lullaby',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', data.audioFile);
    formData.append('name', data.lullabyName);

    post(route('parent.media.lullaby.upload'), {
      onProgress: (event: any) => {
        if (event && typeof event.percentage === 'number') {
          setUploadProgress(event.percentage);
        }
      },
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Lullaby uploaded successfully',
        });
        setData('audioFile', null);
        setData('lullabyName', '');
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to upload lullaby',
          variant: 'destructive',
        });
      },
      onFinish: () => {
        setIsUploading(false);
        setUploadProgress(0);
      },
    });
  };

  const uploadContent = () => {
    if (!data.contentFile || !data.contentName) {
      toast({
        title: 'Error',
        description: 'Please provide both a file and name for the content',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', data.contentFile);
    formData.append('name', data.contentName);

    post(route('parent.media.content.upload'), {
      onProgress: (event: any) => {
        if (event && typeof event.percentage === 'number') {
          setUploadProgress(event.percentage);
        }
      },
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Content uploaded successfully',
        });
        setData('contentFile', null);
        setData('contentName', '');
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to upload content',
          variant: 'destructive',
        });
      },
      onFinish: () => {
        setIsUploading(false);
        setUploadProgress(0);
      },
    });
  };

  const togglePlayback = (lullabyId: string) => {
    post(route('parent.media.lullaby.toggle', { device: device.id, lullaby: lullabyId }));
  };

  const adjustVolume = (value: number) => {
    post(route('parent.media.volume', { device: device.id, volume: value }));
  };

  const toggleProjector = () => {
    post(route('parent.media.projector.toggle', { device: device.id }));
  };

  const setProjectorContent = (contentId: string) => {
    post(route('parent.media.content.set', { device: device.id, content: contentId }));
  };

  return (
    <RoleBasedLayout user={user}>
      <Head title="Media Management" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {device ? (
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
              {/* Device Status */}
              <div className="border-b border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{device.name}</h2>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      device.status === 'online'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
              </div>

              <div className="border-b border-gray-200 bg-white p-6">
                <h1 className="mb-6 text-2xl font-bold">Media Management</h1>

                <Tabs defaultValue="lullabies" className="w-full">
                  <TabsList>
                    <TabsTrigger value="lullabies">Lullabies</TabsTrigger>
                    <TabsTrigger value="projector">Projector</TabsTrigger>
                  </TabsList>

                  <TabsContent value="lullabies">
                    <Card className="p-6">
                      <h2 className="mb-4 text-xl font-semibold">Lullaby Management</h2>
                      
                      <div className="mb-6">
                        <h3 className="mb-2 text-lg font-medium">Upload New Lullaby</h3>
                        <div className="flex gap-4">
                          <Input
                            type="file"
                            accept="audio/*"
                            onChange={handleLullabyUpload}
                            disabled={isUploading}
                          />
                          <Input
                            type="text"
                            placeholder="Lullaby Name"
                            value={data.lullabyName}
                            onChange={(e) => setData('lullabyName', e.target.value)}
                            disabled={isUploading}
                          />
                          <Button onClick={uploadLullaby} disabled={isUploading || processing}>
                            Upload
                          </Button>
                        </div>
                        {isUploading && (
                          <Progress value={uploadProgress} className="mt-2" />
                        )}
                      </div>

                      <div className="mb-6">
                        <h3 className="mb-2 text-lg font-medium">Volume Control</h3>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={device.settings.volume}
                          onChange={(e) => adjustVolume(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <h3 className="mb-2 text-lg font-medium">Lullaby Library</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {lullabies.map((lullaby) => (
                            <Card key={lullaby.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{lullaby.name}</span>
                                <Button
                                  variant={device.settings.current_lullaby === lullaby.id ? 'default' : 'outline'}
                                  onClick={() => togglePlayback(lullaby.id)}
                                >
                                  {device.settings.current_lullaby === lullaby.id ? 'Stop' : 'Play'}
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projector">
                    <Card className="p-6">
                      <h2 className="mb-4 text-xl font-semibold">Projector Management</h2>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Projector Status</h3>
                          <Switch
                            checked={device.settings.is_projector_on}
                            onCheckedChange={toggleProjector}
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="mb-2 text-lg font-medium">Upload New Content</h3>
                        <div className="flex gap-4">
                          <Input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleContentUpload}
                            disabled={isUploading}
                          />
                          <Input
                            type="text"
                            placeholder="Content Name"
                            value={data.contentName}
                            onChange={(e) => setData('contentName', e.target.value)}
                            disabled={isUploading}
                          />
                          <Button onClick={uploadContent} disabled={isUploading || processing}>
                            Upload
                          </Button>
                        </div>
                        {isUploading && (
                          <Progress value={uploadProgress} className="mt-2" />
                        )}
                      </div>

                      <div>
                        <h3 className="mb-2 text-lg font-medium">Content Library</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {projectorContent.map((content) => (
                            <Card key={content.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{content.name}</span>
                                <Button
                                  variant={device.settings.current_content === content.id ? 'default' : 'outline'}
                                  onClick={() => setProjectorContent(content.id)}
                                >
                                  {device.settings.current_content === content.id ? 'Active' : 'Select'}
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <p className="text-gray-500 text-center">No device assigned. Please contact support to set up your device.</p>
            </div>
          )}
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default Media;
