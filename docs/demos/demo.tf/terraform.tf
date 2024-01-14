terraform {
  required_providers {
    null = {
      source  = "jsiac.com.cn/hashicorp/null"
      version = "3.2.1"
    }
    local = {
      source  = "jsiac.com.cn/hashicorp/local"
      version = "2.4.0"
    }
  }
}

variable "test" {
  type = string
}

variable "test2" {
  type = string
}

data "aws_vpc" "test" {
  cidr_block = "test"
}

module "test" {
  source = "./test"
}

resource "aws_vpc" "test" {
  cidr_block = "test"
  tags = {
    a = "a"
  }
}

data "aws_vpc" "test" {
  filter {
    name = "tag:a"
    values = [
      "a"
    ]
  }
  cidr_block = "test"
}

data "aws_vpc" "test2" {
  filter {
    name = "tag:a"
    values = [
      "a"
    ]
  }
  cidr_block = "test"
}

resource "innerBlock" "innerBlock" {
  a = "a"
  provisioner "local-exec" {
    command = "echo hello"
  }
  provisioner "local-exec" {
    command = "echo world"
  }
}

locals {
  a = "a"
  b = 123
  c = aws_vpc.test.x
}

resource "locals" "locals" {
  a = local.a
}

import {
  to       = innerBlock.innerBlock
  id       = "id"
  provider = arg
}

resource "tags" "tags" {
  tags = {
    a = "a"
    b = "b c d"
  }
}

provider "aws" {
  region  = "ap-southeast-1"
  profile = "test"
}

resource "tfg2" "tfg2" {
  tfg2 = "tfg2"
}

