terraform {
  required_providers {
    vsphere = {
      source  = "jsiac.com.cn/hashicorp/vsphere"
      version = "1.15.0"
    }
  }
}
provider "vsphere" {
  vsphere_server       = "20.46.119.128"
  user                 = "zhajj1@vsphere.local"
  password             = "ZhaJB39!&"
  allow_unverified_ssl = "true"
}
data "vsphere_datacenter" "dc" {
  name = "VM_ZSL_TEST_DB"
}
data "vsphere_compute_cluster" "cluster" {
  name          = "ZSL_TEST_PTZ"
  datacenter_id = data.vsphere_datacenter.dc.id
}
data "vsphere_datastore" "datastore" {
  name          = "HW18500_VM_002"
  datacenter_id = data.vsphere_datacenter.dc.id
}
data "vsphere_network" "network" {
  name          = "VM Network 1591"
  datacenter_id = data.vsphere_datacenter.dc.id
}
data "vsphere_virtual_machine" "template" {
  name          = "template_mysql8021_yg_2023011"
  datacenter_id = data.vsphere_datacenter.dc.id
}
resource "vsphere_virtual_machine" "standalone" {
  name             = "IAC-TEST-YYJGYZT-VM"
  resource_pool_id = data.vsphere_compute_cluster.cluster.resource_pool_id
  datastore_id     = data.vsphere_datastore.datastore.id
  num_cpus         = 4
  memory           = 4096
  guest_id         = data.vsphere_virtual_machine.template.guest_id
  network_interface {
    network_id   = data.vsphere_network.network.id
    adapter_type = data.vsphere_virtual_machine.template.network_interface_types[0]
  }
  disk {
    label            = "IAC-TEST-YYJGYZT-VM1.vmdk"
    size             = 50
    unit_number      = 1
    eagerly_scrub    = data.vsphere_virtual_machine.template.disks.0.eagerly_scrub
    thin_provisioned = data.vsphere_virtual_machine.template.disks.0.thin_provisioned
  }
  clone {
    template_uuid = data.vsphere_virtual_machine.template.id
    linked_clone  = false
    customize {
      timeout = 20
      linux_options {
        host_name = "IAC-TEST-YYJGYZT-VM"
        domain    = "example.com"
      }
      network_interface {
        ipv4_address = "20.46.91.36"
        ipv4_netmask = "24"
      }
      ipv4_gateway = "20.46.91.10"
      dns_server_list = [
        "8.8.8.8"
      ]
    }
  }
}

