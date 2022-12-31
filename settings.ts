import _settings from '@/settings.json';

if (!_settings.base_url) {
  throw new Error('Missing value for base_url');
}

const settings = {
  base_url: _settings.base_url,
};

export default settings;
