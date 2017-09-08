# Koboviewer

A map viewer for point and polyline data in a Kobo Toolbox repository.

## Installation

1. Clone this repository and `cd` into your new `koboviewer` directory.

2. Install the required Python packages: `pip install -r requirements.txt`

3. Start the server: `./run`

## Configuration

Edit the configuration settings in `static/config.js` to suit your situation.

Set `config.api_url` to point at a KoboToolbox API server.

To speed up the loading of map data, it is strongly recommended that
you enable gzip compression on your KoboToolbox server.
KoboToolbox is typically served through `nginx`;
to enable gzip compression, edit your `/etc/nginx/nginx.conf`.
Here are some settings that are known to work:

    gzip on;
    gzip_disable "msie6";

    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
