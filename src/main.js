let filterEnabled = false;

function containsCyrillic(text) {
  const cyrillicRegex = /[а-яА-ЯёЁ]/;
  return cyrillicRegex.test(text);
}

function filterRecommendations() {
  const recommendedVideos = document.querySelectorAll('ytd-rich-item-renderer, ytd-shelf-renderer, #content');

  recommendedVideos.forEach(video => {
    const title = video.querySelector('#video-title');
    if (title && containsCyrillic(title.textContent)) {
      video.style.display = 'none';
    }
  });
}

function enableFilter() {
  filterEnabled = true;
  filterRecommendations();

  const observer = new MutationObserver(() => {
    if (filterEnabled) {
      filterRecommendations();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}

function disableFilter(observer) {
  filterEnabled = false;
  const recommendedVideos = document.querySelectorAll('ytd-rich-item-renderer, ytd-shelf-renderer, #content');
  recommendedVideos.forEach(video => {
    video.style.display = '';
  });

  observer.disconnect();
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'enableFilter' && !filterEnabled) {
    observer = enableFilter();
  } else if (message.action === 'disableFilter' && filterEnabled) {
    disableFilter(observer);
  }
});

browser.storage.local.get('filterEnabled').then((result) => {
  if (result.filterEnabled) {
    observer = enableFilter();
  }
});
