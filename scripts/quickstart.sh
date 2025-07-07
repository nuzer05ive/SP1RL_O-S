#!/usr/bin/env bash
cp .env.example .env
pnpm i
pnpm --filter microsite dev
