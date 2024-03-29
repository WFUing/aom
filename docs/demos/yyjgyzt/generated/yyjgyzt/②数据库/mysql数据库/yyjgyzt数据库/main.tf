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


resource "null_resource" "ansible_playbook" {
  triggers = {
    always_run = timestamp()
  }
  connection {
    type     = "ssh"
    user     = "root"
    password = "hU9#ImltQjnvmH1"
    host     = "20.46.99.98"
    port     = 10022
  }
  provisioner "remote-exec" {
    command = "cd /root/test-gitops/yyjgyzt应用架构一张图/yyjgyzt_system/"
  }
  provisioner "remote-exec" {
    command = "ls -all"
  }
  provisioner "remote-exec" {
    command = "cd /root/test-gitops/yyjgyzt应用架构一张图/yyjgyzt_system/②数据库/mysql数据库/yyjgyzt数据库/ansible-playbook/ "
  }
  provisioner "remote-exec" {
    command = "ls -all"
  }
  provisioner "remote-exec" {
    command = "echo '20.46.91.36:22 '  >  ./inventory/inventory.ini  "
  }
  provisioner "remote-exec" {
    command = "ansible-playbook tasks/main.yml -i inventory/inventory.ini -e \"ansible_ssh_user=root ansible_ssh_pass=jsepc123! mysql_source_files_path=/root/test-gitops/yyjgyzt应用架构一张图/yyjgyzt_system/ mysql_schema_namae=yyjg mysql_character=utf8 mysql_collate=utf8_general_ci mysql_user_name=yyjg mysql_user_password=1dsjahdkjKM# \" "
  }
}

