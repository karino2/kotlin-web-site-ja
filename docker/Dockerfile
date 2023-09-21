FROM jekyll/jekyll

ENV PROJECT_ROOTDIR /srv/jekyll
WORKDIR $PROJECT_ROOTDIR
COPY $PWD $PROJECT_ROOTDIR

RUN bundle install

CMD ["jekyll", "--help"]
ENTRYPOINT ["/usr/jekyll/bin/entrypoint"]
WORKDIR /srv/jekyll
VOLUME  /srv/jekyll
EXPOSE 35729
EXPOSE 4000
