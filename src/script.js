const filter = document.getElementById('filter');

function updateStatus(isEnabled) {
  if (isEnabled) {
    filter.textContent = 'Выключить';
    filter.classList.add('active');
  } else {
    filter.textContent = 'Включить';
    filter.classList.remove('active');
  }
}

filter.addEventListener('click', () => {
  browser.storage.local.get('filterEnabled', function(data) {
    const isEnabled = !data.filterEnabled;
    browser.storage.local.set({ filterEnabled: isEnabled });
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        action: isEnabled ? 'enableFilter' : 'disableFilter',
      });
    });
    updateStatus(isEnabled);
  });
});

browser.storage.local.get('filterEnabled', function(data) {
  const isEnabled = data.filterEnabled || false;
  updateStatus(isEnabled);
});
