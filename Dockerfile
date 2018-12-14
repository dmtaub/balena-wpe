FROM petrosagg/resin-wpe:raspberrypi3-30c7465

COPY udev-rules/ /etc/udev/rules.d/

COPY wpe-init /wpe-init

CMD [ "/wpe-init" ]

COPY 3dfun /var/lib/public_html

ENV WPE_URL "file:///var/lib/public_html/index.html"
