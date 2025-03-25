source "https://rubygems.org"

# Use GitHub Pages
gem "github-pages", group: :jekyll_plugins

# Required for Ruby 3.0+
gem "webrick"

# Plugins supported by GitHub Pages
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  # Add other GitHub Pages compatible plugins here
end

# Windows and JRuby dependencies
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]