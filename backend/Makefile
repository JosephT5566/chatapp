# Path and Variables
SHELL := /bin/bash
PROJECT := chat-app
ROOT_DIR := $(CURDIR)

.PHONY: deps deps-rust semver vernemq-auth-plugin docker-vernemq-auth-plugin

###########################################################
### Build 

build:
	cargo build --bin chat --release

build-debug:
	cargo build --bin chat 

###########################################################
### Local Deployment

local:
	cargo run --bin chat
