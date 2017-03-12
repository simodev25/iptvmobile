export class ChannelResulta {
  id: number;
  channelName: string;
  description: string;
  thumbnailUrl: string;
  channelUrl: string;
  channelActive: boolean;

  constructor(obj?: any) {

    this.id = obj && obj.id || null;
    this.channelName = obj && obj.channelName || null;
    this.description = obj && obj.description || null;
    this.thumbnailUrl = obj && obj.thumbnailUrl || null;
    this.channelUrl = obj && obj.channelUrl || null;
    this.channelActive = obj && obj.channelActive || null;
  }
}
