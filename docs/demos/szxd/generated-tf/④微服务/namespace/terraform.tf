terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.18.1"
    }
  }
}

provider "kubernetes" {
  host = "https://192.168.130.13:6443"
}

resource "kubernetes_namespace" "ns" {
  metadata {
    name = "iac-test-yyjgyzt"
  }
}

