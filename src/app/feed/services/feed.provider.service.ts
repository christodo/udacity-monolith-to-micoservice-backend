import { Injectable } from '@angular/core';
import { FeedItem, feedItemMocks } from '../models/feed-item.model';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from '../../api/api.service';
import {environment} from '../../../environments/environment';

const API_HOST_FEED = environment.apiHostFeed;

@Injectable({
  providedIn: 'root'
})
export class FeedProviderService {
  currentFeed$: BehaviorSubject<FeedItem[]> = new BehaviorSubject<FeedItem[]>([]);

  constructor(private api: ApiService) { }

  async getFeed(): Promise<BehaviorSubject<FeedItem[]>> {
    const url = `${API_HOST_FEED}/feed`;
    const req = await this.api.get(url);
    const items = <FeedItem[]> req.rows;
    this.currentFeed$.next(items);
    return Promise.resolve(this.currentFeed$);
  }

  async uploadFeedItem(caption: string, file: File): Promise<any> {
    const url = `${API_HOST_FEED}/feed`;
    const res = await this.api.upload(url, file, {caption: caption, url: file.name});
    const feed = [res, ...this.currentFeed$.value];
    this.currentFeed$.next(feed);
    return res;
  }

}
