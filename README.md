# Koboviewer

A map viewer for point and polyline data in a Kobo Toolbox repository.

## Installation

1. Clone this repository and `cd` into your new `koboviewer` directory.

2. Install the required Python packages: `pip install -r requirements.txt`

3. Start the server: `./run`

## Configuration

Edit the configuration settings in `static/config.js` to suit your situation.

Set `config.api_url` to point at a KoboToolbox API server.

Koboviewer serves requests on port 5000 (see the `run` script).
In a typical Kobo Toolbox setup, you would use a `proxy_pass` directive
to make `nginx` route requests to Koboviewer.

For example, to make the Koboviewer map available at
`https://kf.[your-domain]/map` in a Kobodocker installation,
edit the file `kobo-docker/nginx/nginx_site_https.conf.tmpl`
and insert these lines:

    rewrite ^/map$ /map/ permanent;
    location /map/ {
        proxy_pass http://127.0.0.1:5000/;
    }

at the end of the `server { ... }` section labelled "# KoBoForm HTTPS",
just inside the closing `}`.  Then restart `nginx` with the command:

    docker exec -it kobodocker_nginx_1 service nginx restart

You should then be able to open `https://kf.[your-domain]/map` in a browser.

To speed up the loading of map data, it is strongly recommended that
you enable gzip compression on your KoboToolbox server.
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

Since the vector data for the map comes from KoboCat (not KoboForm),
these gzip settings should go in the `server { ... }` section
labelled "# KoBoCat HTTPS".
