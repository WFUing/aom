module "module-mysql-instance" {
  source = "./②数据库/mysql数据库/yyjgyzt数据库/"
}
module "delayed_call" {
  source = "./④微服务/namespace/"
}
module "module-app-namespaces" {
  source = "./④微服务/namespace/"
}
module "module-mysql-instance" {
  source = "./②数据库/mysql数据库/yyjgyzt数据库/"
}
module "module-app-instance-szxd" {
  source = "./④微服务/service_yyjgyzt/"
}
module "module-vSphere1" {
  source = "./①云平台/vsphere/"
}
