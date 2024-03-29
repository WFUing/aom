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
    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }
    vsphere = {
      source  = "hashicorp/vsphere"
      version = "1.15.0"
    }
  }
}

provider "kubernetes" {
  host                   = "https://192.168.130.13:6443"
  client_certificate     = base64decode("LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURFekNDQWZ1Z0F3SUJBZ0lJT2RSZUFYNk9JVUl3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TkRBeE1URXhNak14TkRSYUZ3MHlOVEF4TVRBeE1qTXhORFphTURReApGekFWQmdOVkJBb1REbk41YzNSbGJUcHRZWE4wWlhKek1Sa3dGd1lEVlFRREV4QnJkV0psY201bGRHVnpMV0ZrCmJXbHVNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQTFBRTc1MFdCMjQ4L3M3VlYKVHRuT0tOb2pORHF5RjNNUWx5R0YxZVBZWUl2ODBxNEZLQS9HRGErbUhlbkZxTC9CZ0VacFlQbDRxZmhrbnpjcApuWW5KUk84eDdOR1ovUlJEQTN0dFYzMnRJaEg5YjVRZlpaOXRvQ3djRG93SjRsaElBd3l6cWFUeEpQQ3VLc0NPClF0UlRrWXY2U0puajRzblBaQUJEUUpkdjJuRzRWeW16M2JlT2Y4aVJIalBIM3dVaFc2V0c4R1dhdUdVb3pBVmgKU1BtZG9FNklTQXdKMVI5NnhoT2hYYWlSNVdBekhvallGR1lzdHFEb1JFUlZ1dXBramc3Z2RnYzQ5WVJIREVMNApJUVYyaTFWWXZQTnd1VDVFellxL25TZjdKRkxhbjJQdDdZK0kxTTUzNzhBRUV2bzU0QlY1OXU2MndLMisrUmRKCjVha2F2UUlEQVFBQm8wZ3dSakFPQmdOVkhROEJBZjhFQkFNQ0JhQXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUgKQXdJd0h3WURWUjBqQkJnd0ZvQVUvT200cUJIUTlXZHYrcExOZXN1N253QkhtMVV3RFFZSktvWklodmNOQVFFTApCUUFEZ2dFQkFDWVVLQWsyY3VQNEdDSUhoQ00raTU0ZnMvTUp5MnA3UmpTVTJieVNFb0o1R0ZLakdyZjlLVGxFCmZqNFhQRnBUb1BiYjZrbU1venM3eEs3UnRjK3B5NnFYR29PRWFJYTRLdnJ4cEcyN0VteE5Wd0tPWFRXUlUvMDYKYWZxM05qcTlMQlB2UjkvY0xBOGhUVnlpR28waEtMQXFleVdYR2pZcloxRThla3IxNWkxRWt2S015dk5URU5rbgpxWHhQNmI0TS9GSzgyVmhnbU9ka3VaditKcUp2UGp6Z2d3cGZnT1ROQnBOeUkxREl0aEdEVXlHZDNvL3piQnpZCnNycFFESDFIK0RoY2laYndCNkdmdlZWb2JRMFN6T0dPWjJEMndLRXNYNjJIWjA1eUduTDdDaFkrVGRaV0Z6NmIKOXlzUVJ1T3gzZ2VkZXJicEo0Vm9vOUlhNjNxOWZmaz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=")
  client_key             = base64decode("LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBMUFFNzUwV0IyNDgvczdWVlR0bk9LTm9qTkRxeUYzTVFseUdGMWVQWVlJdjgwcTRGCktBL0dEYSttSGVuRnFML0JnRVpwWVBsNHFmaGtuemNwblluSlJPOHg3TkdaL1JSREEzdHRWMzJ0SWhIOWI1UWYKWlo5dG9Dd2NEb3dKNGxoSUF3eXpxYVR4SlBDdUtzQ09RdFJUa1l2NlNKbmo0c25QWkFCRFFKZHYybkc0VnltegozYmVPZjhpUkhqUEgzd1VoVzZXRzhHV2F1R1VvekFWaFNQbWRvRTZJU0F3SjFSOTZ4aE9oWGFpUjVXQXpIb2pZCkZHWXN0cURvUkVSVnV1cGtqZzdnZGdjNDlZUkhERUw0SVFWMmkxVll2UE53dVQ1RXpZcS9uU2Y3SkZMYW4yUHQKN1krSTFNNTM3OEFFRXZvNTRCVjU5dTYyd0syKytSZEo1YWthdlFJREFRQUJBb0lCQURXWWVrUmxWZ2JqbC84ZQpnSXFHbFkvT1ZjZ0dicTl1NzJyRmxzZ1Q2Y2UrbkJQRzJwYmVKZnVmeENjYnlsUjI1YnhBRUxQclhZM2F0ZFZxClpLTG5DbkxhNVl3eEVQVGlBbThHN1FXSlNCT3M2SjBrblN0YnVxTWJnNXhKMnRYVjY1Nlp2M0hMdVFyVnJiSXgKSzhYSlY3Y2I1QkltbFczb0J2NEk4dmVKVVVXdnRGVXc5cWxvOWxrT2Q4aHJqUGErVEdhcWk3YzYvaE1RdVBkMwpPTjZHWVlCMEl0ZEJYcW1QUkhEVWtxb1JkKzMrMm1CSkQzajY5V2pRNGNBajhsZ2xrd01icFFpQzRYZjF2YXErCi85cHM2NU5VMVRjMjIrN0h3NTNFOGlUdGFueTlQQVN3TVpaRndDNkhyU2pwa1ZQNk90LzV3NzllbzdFTWRDMmEKd3MwMDRTRUNnWUVBNWN1VkNKVWhISjYrWkhaKy9PZHNTUm1Qd1VpRm1iNnBjVWl3Vnk1dHl1dGMwQmRoYUw2dApxM1g3ZFkwZTEweWpkVFFhMmZVelJHNnVNT21aUzBac2tGa1F3OHRpZWVCUzJVV0Fidkl3alFwdUdDYWxEWFBECjloakE2cGpYWGpUdHNMYjVHeDlxOHVwVGpOZUx1N2drT1VrQ3VmeXg0bXU2V2lvUUw4dzZFOE1DZ1lFQTdDNUwKcmJnWFlDdmZ3enMvUjBrQnZobHUzQUNHVGFVVDZkSHlSTHNCZ0VhWWE3N2c3VStWejg1SlVJeGRNcUhIblN3RApzTFdZeWRCeElhVCtrR01RUXBUdnBiQVZjeVFwamVodkRza0dndWJnY2Zna3pqdG9lR2JIMnd0OXZZa01oYmpDCi9EMG9FaFJqQVJhZDc2TzJRSGFkZ2lkeFVTOC9OZTJUaE1iZHIzOENnWUFsZ2VJMGdXcmpLZ0gza2VQT1VkTzUKNXNNeEVDNUdWdmwvTlJjYlU4ZTE3RTY4NUdRUTNiYXBHdHZOWnhoV21mckFJWjRVWDFKYjVCam9nT2gxZ2V3cwpiMjB1R0I5ZHQwQ3VtQXFMa1ZwZFd3dDNRNitERDVjM3J2aW1FZ1p0S1FSMjZKYW1WNjEwTXMwcVd2QkMxcDZLCi95RER6THdZTWU4NzBrdk1FWENWVXdLQmdRQ1IrMXVUbU1INkU2UlBUQU9rMEI5Zm5PREU0eDRnUi9TekJhMjEKaGRFN3RHYnAwaVc5Q1FBVVhmRTY5RWQyMEVCTmliTU9PbkNoN1ZDLzl2ZlJ6eWx4dmhVU1dIQXBweVI0TGo3Vwo2TEk1bnZNRC90amhFQjlXckZERHQ2cVV5RzBSQ2s2YkVrSCtTdE9YREorNlMzcVBCY0g5Zk51eHpuNUhtdjBmCmlMdmxpUUtCZ1FEWWRIZStGb1F5UnJjOGErTTBJM3dpN0VsMkt5aFMxVW94VENUSlFyZGkrTDQzbzEwTFhiT2oKV2Z0Q0F5ajFaeXV3Ni9NdUIxbzJZK2JISnRGN2FpY3pydmFxc0wzVUZMSVRzdlRrd0hIYW83cHdJVW1oVjEzUAovblovSElWblpHajZiRFBnbis3MFhaWDA4MXpjSElKWmt3ZXFRZTRqbWZEN20xbW51dTF3QlE9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=")
  cluster_ca_certificate = base64decode("LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1ekNDQWMrZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRJME1ERXhNVEV5TXpFME5Gb1hEVE0wTURFd09ERXlNekUwTkZvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTEJjClQ0dHFnei9Jc1B1Njg4QkFCVkJ3MGpFZ3JRMkczVUMyL051UUtxMUJObjNZV21qZGc2VGdodE9kNW5oM0UyUVIKdWhIMlRwK1U4cmIySFFMMTR1SEdMMmdEbE1iZXlJR3FMU0FwWWVHQ09GTDVWKytDYVNXb3cvUGVubUE0a3Q4egpjUENYSVl2UGVWOVZBTndGbUEvZDRrV0dUWEhETE5QV0k0bzNsWmdpZEdZM0lXa2hhcVQ4Q0tVYjdWd3hTeTV0CjVMZ1JTbkpTVEdPK2pkSUwrY1RXYW5BU0k5Y3FzMDVwcmR5aFBjcVMzRS9SdGhRQU1ZQ2RSM2U5YSsybjdUNjgKTWJ2YTM2bjB4Q3Q3Z3dPaWRkMEtUUHgrUlQ5blZTNkR4M1Z4NVNUaEFNMHNCT3FaN2l4bU9hbHNkR2kwNnY5OQpDNytQKzhsTHNVQ2RHZmxqam9FQ0F3RUFBYU5DTUVBd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0hRWURWUjBPQkJZRUZQenB1S2dSMFBWbmIvcVN6WHJMdTU4QVI1dFZNQTBHQ1NxR1NJYjMKRFFFQkN3VUFBNElCQVFDcSsvY1ZoSnZzZzUyQ3FiajdhZ2JuVktVMk54eVFTNEl2QTFLOXU5c21qRnFzUXF0UApRa1plRXlJL3VuT0FZSDhadXY5WS9BeXp3YlNNa0x0eVRGY0toRi9TTlRtaS9YajVWVis2bWM2NWxUTkN1OThqCmxCYXpLUUlXWEJKQUFWR3BZZ1lPSVJiSWNYN29UV1F2Z3dIUEVmVVBaK3NqMHdLT25UUHphcVlLbVpKa2NYMXgKeFhEektVQmpIMkVabS9TSjZZdS9INytQQ3V1OWtZVUUrVEhVYmVRN3N4WCtlVjNab1N4NHdGRytJcWhQRThIcgpzZXlDc0lwenQ3MEs0ZDBSQkZFMWFrR0hWOEgyM3Y5ZnBJTXJ6Njc4bHVoOTR1UmRMaGNuOUtJWTNkUEFid3hlCkVaeXl1WG45K2JCNCtUeDNQTlAvUEhsV3M3Ukk2Y0JlUHltdgotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==")
}

provider "vsphere" {
  vsphere_server       = "192.168.130.250"
  user                 = "administrator@cc.cc"
  password             = "1qaz0OKM!@#"
  allow_unverified_ssl = true
}

resource "kubernetes_deployment" "nginx" {
  depends_on = [
    kubernetes_namespace.ns,
    time_sleep.wait30s
  ]
  metadata {
    name      = "iac-szxd-nginx"
    namespace = "iac-test-szxd1"
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
          image = "chitayousa/test:nginx-2"
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

resource "kubernetes_service" "nginx" {
  depends_on = [
    kubernetes_namespace.ns,
    time_sleep.wait30s
  ]
  metadata {
    name      = "iac-szxd-nginx"
    namespace = "iac-test-szxd1"
  }
  spec {
    selector = {
      app = "iac-szxd-nginx"
    }
    type = "NodePort"
    port {
      port        = 8000
      node_port   = 30357
      target_port = 8000
    }
  }
}

resource "kubernetes_deployment" "server" {
  depends_on = [
    kubernetes_namespace.ns,
    time_sleep.wait30s
  ]
  metadata {
    name      = "iac-szxd-server"
    namespace = "iac-test-szxd1"
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "iac-szxd-server"
      }
    }
    template {
      metadata {
        labels = {
          app = "iac-szxd-server"
        }
      }
      spec {
        container {
          image = "chitayousa/test:app-c2"
          name  = "iac-szxd-server"
          command = [
            "java",
            "-Dserver.port=8000"
          ]
          args = [
            "-jar",
            "/opt/szxd.jar"
          ]
          port {
            container_port = 8000
          }
          resources {
            limits = {
              cpu    = "4000m"
              memory = "8000Mi"
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

resource "kubernetes_service" "server" {
  depends_on = [
    kubernetes_namespace.ns,
    time_sleep.wait30s
  ]
  metadata {
    name      = "iac-szxd-server"
    namespace = "iac-test-szxd1"
  }
  spec {
    selector = {
      app = "iac-szxd-server"
    }
    type = "NodePort"
    port {
      port        = 8000
      node_port   = 30356
      target_port = 8000
    }
  }
}

resource "null_resource" "ansible_playbook" {
  depends_on = [
    vsphere_virtual_machine.standalone,
    time_sleep.wait
  ]
  triggers = {
    always_run = timestamp()
  }
  connection {
    type     = "ssh"
    user     = "root"
    password = "1qaz0OKM@!"
    host     = "192.168.111.7"
    port     = "22"
  }
  provisioner "remote-exec" {
    inline = [
      "cd /root/iac-test-szxd/sxbak/ansible-playbook/  ; echo '192.168.130.249:22 '  >  ./inventory/inventory.ini ;  ansible-playbook tasks/main.yml  -i inventory/inventory.ini -e \"ansible_ssh_user=root ansible_ssh_pass=7232411 mysql_source_files_path=/root/iac-test-szxd/sxbak/ansible-playbook/files mysql_schema_namae=szxd mysql_character=utf8 mysql_collate=utf8_general_ci mysql_user_name=szxd mysql_user_password=Cc123!@#\" "
    ]
  }
}

resource "kubernetes_namespace" "ns" {
  depends_on = [
    null_resource.ansible_playbook
  ]
  metadata {
    name = "iac-test-szxd1"
  }
}

data "vsphere_datacenter" "dc" {
  name = "VM_ZSL_TEST_DB"
}

data "vsphere_compute_cluster" "cluster" {
  name          = "ZSL_TEST_PTZ"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_datastore" "datastore" {
  name          = "datastore2"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_network" "network" {
  name          = "VM Network"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_virtual_machine" "template" {
  name          = "template_mysql8021_yg_20230111"
  datacenter_id = data.vsphere_datacenter.dc.id
}

resource "vsphere_virtual_machine" "standalone" {
  name             = "IAC-TEST-SZXD-VM"
  resource_pool_id = data.vsphere_compute_cluster.cluster.resource_pool_id
  datastore_id     = data.vsphere_datastore.datastore.id
  num_cpus         = 2
  memory           = 2048
  guest_id         = data.vsphere_virtual_machine.template.guest_id
  network_interface {
    network_id   = data.vsphere_network.network.id
    adapter_type = data.vsphere_virtual_machine.template.network_interface_types[0]
  }
  disk {
    label            = "IAC-TEST-SZXD-VM0.vmdk"
    size             = 50
    unit_number      = 0
    eagerly_scrub    = data.vsphere_virtual_machine.template.disks.0.eagerly_scrub
    thin_provisioned = data.vsphere_virtual_machine.template.disks.0.thin_provisioned
  }
  clone {
    template_uuid = data.vsphere_virtual_machine.template.id
    linked_clone  = false
  }
}

resource "time_sleep" "wait" {
  create_duration = "300s"
}

resource "time_sleep" "wait30s" {
  create_duration = "30s"
}

