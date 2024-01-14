terraform {
  required_providers {
    vsphere = {
      source  = "hashicorp/vsphere"
      version = "1.15.0"
    }
  }
}

provider "vsphere" {
  vsphere_server       = "192.168.130.250"
  user                 = "administrator@cc.cc"
  password             = "1qaz0OKM!@#"
  allow_unverified_ssl = true
}

data "vsphere_datacenter" "dc" {
  name = "VM_ZSL_TEST_DB"
}

data "vsphere_compute_cluster" "cluster" {
  name          = "ZSL_TEST_PTZ"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_datastore" "datastore" {
  name          = "datastore1"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_network" "network" {
  name          = "VM Network"
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
  num_cpus         = 2
  memory           = 2048
  guest_id         = data.vsphere_virtual_machine.template.guest_id
  network_interface {
    network_id   = data.vsphere_network.network.id
    adapter_type = data.vsphere_virtual_machine.template.network_interface_types[0]
  }
  disk {
    label            = "IAC-TEST-YYJGYZT-VM0.vmdk"
    size             = 50
    unit_number      = 0
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
        ipv4_address = "192.168.130.249"
        ipv4_netmask = "VM Network"
      }
      ipv4_gateway = "192.168.130.254"
      dns_server_list = [
        "8.8.8.8"
      ]
    }
  }
}

