terraform {
  required_providers {
    kubernetes = {
      source  = "jsiac.com.cn/hashicorp/kubernetes"
      version = "2.18.1"
    }
  }
}
provider "kubernetes" {
  host                   = "https://20.46.101.14:6443"
  client_certificate     = base64decode("LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM4akNDQWRxZ0F3SUJBZ0lJRVI1VExPczh4ZVV3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TURFeE1Ua3dPVFEyTXpoYUZ3MHpNVEV4TVRjd01UUTJOREphTURReApGekFWQmdOVkJBb1REbk41YzNSbGJUcHRZWE4wWlhKek1Sa3dGd1lEVlFRREV4QnJkV0psY201bGRHVnpMV0ZrCmJXbHVNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXpiYnhHbnJaVUdONDcrRlQKYWxCajZxeU9nSm5DWjZVejV2angwM1c4RHVTOWY0VFY3Nm8vYm03ci9MaUJnMDNjUnhHRllUZUM0TjYzTnpCTgpVdXV2MVgwYzhQenJ4UHZlWTZBOTlST0UvZVNSbFVrcVVWazJBUXY1dWU0eDRqemEvYjQ5UHkvRkYyejNaelNOCmRSb3pwbStxUWxyUXVzaVlRbGs0Yk5yYnFFazByQVVwNFRlWFp1UW9Hc1o5aUFLYjRHUGhvbFJDbnRvSkZ6eGEKc0dhSy9zL0tydURrQWVxaVV1bXVWNmV4dWtkS1MzWjdwVkpNNVRiMWhwZFFIYnZOTGFUb2dxcVkwbGZqTEpkUwpXYnlyc2p6eTI3NTlKRHp3NWxEcmlwcUJhRTVRWHFNT3IrdmoxOEw2SDBCallDaVFYVVNEWVdrU2YwOFVDa0txCmV4djU1d0lEQVFBQm95Y3dKVEFPQmdOVkhROEJBZjhFQkFNQ0JhQXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUgKQXdJd0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFETmtaYVVYZ0VvNS82Z3NWRjNiQXNhcWV3dkRxUVZXd2ZiVwpWNWpRWnZvYk1VL2huYmkvNndLOEpFYzduZkUxRWlyOGpWZThJT2VZRXl0ZUx0b2lqMS8vc0pBNitZdnY3SllkCkVyYnhKZ0RlaFhYcy9DakdrU010Mmd5dDhXellDTGVFbE1XRTNpTEJMcWhoc3JxNlQrOWhpQ0x4MnFWWTlwWSsKbkwrR1BhYlZ3K2Z0aTYxKzdiQ0htMVR3ekpKOTFLVnVUREw2SWtQVjRsS2k3aFdrWkViZ3RiUDk0QjI1ZWREbQp0dDYyRlhkSzVQZHJvT3JlS3R5VVZGcGZvYzZRcTZaazlHOVh6dkdZNnRYODZ2UFg5c0g2eTFXSjlsby8ySzJECjgwRWVSV2EwSm0yNzNYUGVLMlVaMFo2Y05DcXgxODU2MTREcFJoSklxNXEzRVgrZzdjST0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=")
  client_key             = base64decode("LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb2dJQkFBS0NBUUVBemJieEduclpVR040NytGVGFsQmo2cXlPZ0puQ1o2VXo1dmp4MDNXOER1UzlmNFRWCjc2by9ibTdyL0xpQmcwM2NSeEdGWVRlQzRONjNOekJOVXV1djFYMGM4UHpyeFB2ZVk2QTk5Uk9FL2VTUmxVa3EKVVZrMkFRdjV1ZTR4NGp6YS9iNDlQeS9GRjJ6M1p6U05kUm96cG0rcVFsclF1c2lZUWxrNGJOcmJxRWswckFVcAo0VGVYWnVRb0dzWjlpQUtiNEdQaG9sUkNudG9KRnp4YXNHYUsvcy9LcnVEa0FlcWlVdW11VjZleHVrZEtTM1o3CnBWSk01VGIxaHBkUUhidk5MYVRvZ3FxWTBsZmpMSmRTV2J5cnNqenkyNzU5SkR6dzVsRHJpcHFCYUU1UVhxTU8Kcit2ajE4TDZIMEJqWUNpUVhVU0RZV2tTZjA4VUNrS3FleHY1NXdJREFRQUJBb0lCQUJ0TytkckdEQ3M3eVVZdQo1MS9wcEJuM0prTzBKYmFVbTd0QnVQaVZYSTJ0bCtwaHUvVEE2UUxEL3RmaHRtK3oybFlrNFV2eWpwRkRmNWIzCjlvdlhkZFFsYzc0YUZVSmxIVFNraFJVUHJrdjJGODExbFFTUGp6ZThXejV2ZkhmSUZGb3k4dlo4WlBHaktZU3QKMlVsK1hQVHZSZTdoRjJ4MFRLSWlMZmRsWmx1RWYxRmYvOFM4U0lJQzVxOThGV29BSUNSWGdTR3FUVmxpVnlCdAo5MjN1MklNSzI3UFRpVUVEWTRMMW9CQlUwV2xjSGNvSlFpOG5lTGhxekVLa3NLSTlHbk5SWlBtNlRVQitjRXJzClI0QUJhVm5BbEZVRVZYalpXSmY1U1ROZFNRTzdqcEJPZEkxUFVEL2crbjg2eHMyQUlWWVNscGkrU1BkMG9kZ2QKTmRNNEVlRUNnWUVBMllKV1padWRwSkxibEdMQlExcGE2RldXS0pUYWFhZnFXR1ZCLzU5aVV6U1NFOWVLYmJGbApTWURNVklqNEwwQTNoOUpyMklycEc1UEV1ZWg5NmxIMWxISHlwVjhxWFM1d2xFVmFtUmVOcjRxNVk0MDRVQ0RhCmszODdGRFlGdjZMTEU3Rlp4a1RlNUV0UGZ1eUoyakM1OXQrYlMxM3ZWWXQvYmUwWVV4UFRyclVDZ1lFQThoNUoKS0MyMDNaTVVjY0F0a29LMUxJWjFoWGNTRUdrN3RjcmwvMkZXNDlCREtsZytMeGJVRXRaUmhXcTdPbjlRS3M5MgpVOEtzd2IyZ3RIUkpqd1hlR0R3N0JibDVNMi9GWXh1WTdoa1VPaGI2bksxOVJtYmdZVjJkS2JPNmFQNnkxcUpQCllNb0tJS1Y4UFNuWkZJa0l0R0V0OTB3d1hDYWNhUjl0OW1leWk2c0NnWUJMd0FDbTBsTk1oWGpEYk1FeDI3M2QKUERGWFlML1FIQktaUm1wOXc5eFNiZlNSeEhjSlRNYWhtcUdPcjBULzc3Vm5ML2t2S1BHV0VSaHFSblhUclVlQgpzMDEyR25aK2pUWFg3VzluOGJQK2RxbXA2Znk2cXpaME45TXpicjBCeUloQkMzcmdlZ3ZHSmhSQmQ4OXFsWjJ1ClJLR28xY1lNWE5DOFQ5NHcwSzdnSVFLQmdGN1ZxZ1lJMFIwdzdRTVpLVUNIM2ZzUXQ1dU5aZy96aUNYTzBZUFUKVnJwbzZzWDlSbTRmWFBYNzZIWi90ZEpWNThxODlEWWV2Smd1ZEhINlVvMm8yTE5aZEN6cjF5Tmtsa1labXk4Mwp0NHFCVWF4bzcvYlJlUFhxT3hNSWlPMXpSZzE0Q2V0NWQ3b04xN29GV0RnSTdOWHFjcHk0eFFCelJ6U04wUDZBCjQ1aDlBb0dBUEVjWDVNT2lKUThqWEtDODBIY3ZQTDVIN1Q0WmJyTkcvYmlKeTVZblRnaHkzS1gzbVYzTGl6QncKZGpUQXRGK0UzejYvMFViUlp2eDRETTRlcFFpaHZ5cXhvVDdEZjErOWJLTXYzY1I2d053M3d6NUI4Y2FkNmk4NgpIYzZKWnF1LzRtb0NqcWhpMFdhV3JNcm5UVzNDTHY5UElmajBqU1N5a1NKU0hZTXFxV1k9Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==")
  cluster_ca_certificate = base64decode("LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRJd01URXhPVEE1TkRZek9Gb1hEVE13TVRFeE56QTVORFl6T0Zvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjY0CllpMEJGTkd4OEZDM0dFeWl3RDRTK00wdW1CeW5KQW5abzNGUDJQdU1lSVF4NXhvNmR1T0E2ZlBUZ05zZnovUC8KbFZ5M21BdlNrRUduMW53Vm1wbEJYRS9rV1IyNWYzQnRzUS9BVEkzclN5SVl2VEZOMWdKOWgvZ3ZyYThFK0FPSQpoNVJaTk0zOExSVnhTODMzeTRDZ1VjZkh3QitPYUFKamhuTFZ0SFlNVmNLeWFwOGJlY3FNTjF3U29icmN0TTlSCk9icTRGWE0xSExYTmpMRGwxR1ZJTk1Yc2dUdUlTOWZUeGxibm9YKytwQXFvTUxVTGF6ZlByQit0SkZnU2hwNE8KMUo0cmZnSlgzSjlyQ1NuZEFCRlpHWFRNNGY2Wnc5dUZZaS9POFZvVWd4UmQ3b3V4UXZ2Nk4zVEdIemI4eTRFOAp0ZjNWTEduV0RkYVRQcUg3N3owQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFGL0RGQ2VEWXo4b2hWMXZpdEd2YWJUTmRzQUoKdXBkeE8yM2dLd2VyV0VaT1ZkNk05MG94d2IrdnhVNVBOQjVESTVLMkFtcTduTjErcFFrTmI1Y1lndEVDTzQvcQpUbjNmeUp4OTNlN3RJMXkwRE10UjRmbXE3NTVvQWJBYU81ZDh4ZzRZa2tXS1lNVi91eTB6aUREM2NJcFlNM1U0CncrZFQzTDhQZHMxcE5hMVF5dUhzUmVmMEZmOUhLaWxQZmpPYThOUDM5VnYzbmVQdEgzc3MrYVV4SGVHMXZ4TUMKYjNYOFVYUXBpQy9xRmdXdlp5d3NJcUU2alFHQTE2MXFXYU9ldjVabnRiVkMreHo3eVRkVzNpV3NybEJSQjA0Ywo0REZQY1hJM05lTFpzTWNTVGE0V082U3VLMUZ4amNXT05NYmRPU3FUUlRwZDhrVUlGU04wNm5hd3RWRT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=")
}


resource "kubernetes_deployment" "scptweb-tm-pc-service-deployment" {
  metadata {
    name      = "iac-yyjg-web"
    namespace = "iac-test-yyjgyzt"
    hasEqu    = false
  }
  spec {
    replicas = 1
    selector {
      match_labels {
        app = "iac-yyjg-web"
      }
    }
    template {
      metadata {
        labels {
          app = "iac-yyjg-web"
        }
      }
      spec {
        container {
          image = "hub.js.sgcc.com.cn/yingxiaoyu/yyjg-web:1.0.9"
          name  = "iac-yyjg-web"
          command = [
            "java",
            "-Dserver.servlet.context-path=/yyjg-web",
            "-Dspring.application.name=yyjg-web",
            "-Deureka.instance.appname=yyjg-web",
            "-Djava.security.egd=file:/dev/./urandom",
            "-Dspring.datasource.druid.master.url=jdbc:mysql://20.46.91.36:33066/yyjg?allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=GMT%2B8",
            "-Dspring.datasource.druid.master.username=yyjg",
            "-Dspring.datasource.druid.master.password=1dsjahdkjKM#",
            "-Dspring.redis.host=20.46.113.55",
            "-Dspring.redis.port=6379",
            "-Dspring.redis.password=aZ7N0FY!miqHV!x",
            "-Deureka.client.serviceUrl.defaultZone=http://10.233.11.194:5607/eureka",
            "-Deureka.instance.prefer-ip-address=true",
            "-DcookieName=XTJS-MSPLATFORM-FIFTH",
            "-Dserver.port=80"
          ]
          args = [
            "-jar",
            "/appac-jggk.jar"
          ]
          port {
            container_port = 80
          }
          resources {
            limits {
              cpu    = "2000m"
              memory = "4000Mi"
            }
            requests {
              cpu    = "100m"
              memory = "500Mi"
            }
          }
        }
      }
    }
    hasEqu = false
  }
}

resource "kubernetes_service" "scptweb-tm-pc-service-svc" {
  metadata {
    name      = "iac-yyjg-web"
    namespace = "iac-test-yyjgyzt"
    hasEqu    = false
  }
  spec {
    selector {
      app = "iac-yyjg-web"
    }
    port {
      port        = 80
      target_port = 80
    }
    hasEqu = false
  }
}

