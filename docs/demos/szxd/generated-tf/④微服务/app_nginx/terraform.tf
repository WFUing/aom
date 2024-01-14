terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.18.1"
    }
    time = {
      source  = "hashicorp/time"
      version = "0.10.0"
    }
  }
}

provider "kubernetes" {
  host = "https://192.168.130.13:6443"
}

resource "time_sleep" "wait" {
  create_duration = "300s"
}

resource "kubernetes_deployment" "deployment" {
  depends_on = [
    "time_sleep.wait"
  ]
  metadata {
    name      = "iac-szxd-nginx"
    namespace = "iac-test-szxd"
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "iac-szxd-nginx"
      }
    }
    template {
      metadata {
        labels = {
          app = "iac-szxd-nginx"
        }
      }
      spec {
        container {
          image = "chitayousa/test:nginx-1"
          name  = "iac-szxd-nginx"
          command = [
            "nginx"
          ]
          args = [
            "-g",
            "daemon off;"
          ]
          port {
            container_port = 8000
          }
          resources {
            limits = {
              cpu    = "2000m"
              memory = "4000Mi"
            }
            requests = {
              cpu    = "100m"
              memory = "500Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "scptweb-tm-pc-service-svc" {
  metadata {
    name      = "iac-yyjg-web"
    namespace = "iac-test-yyjgyzt"
  }
  spec {
    selector = {
      app = "iac-yyjg-web"
    }
    port {
      port        = 80
      target_port = 80
    }
  }
}

