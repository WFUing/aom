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

resource "nm" "df" {
  string  = "str"
  number  = 123
  boolean = true
  stringList = [
    "str1",
    "str2",
    "str3"
  ]
  numberList = [
    111,
    222,
    333
  ]
  booleanList = [
    true,
    false,
    true
  ]
  tuple = [
    "str",
    123,
    true
  ]
  object {
    arg1 = "str"
    arg2 = 123
    arg3 = true
  }
  objectList {
    arg1 = "str"
  }
  objectList {
    arg1 = "str"
  }
  objectListForVariable = [
    {
      arg1 = "str"
    },
    {
      arg1 = "str"
    }
  ]
  map = {
    arg1 = "str"
    arg2 = 123
    arg3 = true
  }
  heredoc = <<EOT
line1
                        line2
                        line3
EOT

  heredocJson = <<EOT
{
  "arg1": "str",
  "arg2": 123,
  "arg3": true
}
EOT

  function1 = max(5, 12, 19)
  functionElement = tolist([
    "a",
    "b",
    "c"
  ])[0]
  custom = max(5, 12, 9)
}

