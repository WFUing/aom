terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
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

