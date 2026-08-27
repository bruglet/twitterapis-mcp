FROM docker.io/library/node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node src ./src

ENV HOST=0.0.0.0
ENV PORT=3000

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "src/index.js"]
