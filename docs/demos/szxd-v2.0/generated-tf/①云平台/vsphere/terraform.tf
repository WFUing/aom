terraform {
  required_providers {
    vsphere = {
      source  = "hashicorp/vsphere"
      version = "1.15.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
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
  depends_on = [
    vsphere_virtual_machine.standalone
  ]
  create_duration = "300s"
}

resource "null_resource" "ansible_playbook" {
  depends_on = [
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
      "cd /root/iac-test-szxd/tttt/generated-tf/②数据库/mysql/szxd数据库/ansible-playbook/  ; echo '192.168.130.249:22 '  >  ./inventory/inventory.ini ;  ansible-playbook tasks/main.yml  -i inventory/inventory.ini -e \"ansible_ssh_user=root ansible_ssh_pass=7232411 mysql_source_files_path=/root/iac-test-szxd/tttt/generated-tf/②数据库/mysql/szxd数据库/ansible-playbook/files mysql_schema_namae=szxd mysql_character=utf8 mysql_collate=utf8_general_ci mysql_user_name=szxd mysql_user_password=Cc123!@#\" "
    ]
  }
}

