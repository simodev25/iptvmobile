import { IpTvMobilePage } from './app.po';

describe('ip-tv-mobile App', function() {
  let page: IpTvMobilePage;

  beforeEach(() => {
    page = new IpTvMobilePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
