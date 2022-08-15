# About

This creates an example GCP Cloud SQL PostgreSQL instance using pulumi.

This will:

* Create a public PostgreSQL instance.
* Configure the PostgresSQL instance to require mTLS.
* Enable automated backups.
* Set a random `postgres` account password.

For further managing the PostgreSQL instance, you could use:

* The [community.postgresql Ansible Collection](https://galaxy.ansible.com/community/postgresql) as in [rgl/ansible-init-postgres](https://github.com/rgl/ansible-init-postgres).

For a terraform equivalent of this example see:

* https://github.com/rgl/terraform-gcp-cloud-sql-postgres

# Usage (Windows)

Install the `gcloud` application:

See https://cloud.google.com/sdk/docs/install

Install the pulumi dependencies:

```powershell
choco install -y pulumi --version 3.37.2
choco install -y nodejs-lts --version 16.16.0
npm install
```

Login into your GCP account:

```bash
# see https://cloud.google.com/sdk/docs/authorizing
gcloud auth login --no-launch-browser
gcloud config set project PROJECT_ID # see gcloud projects list
gcloud config set compute/region REGION_ID # see gcloud compute regions list
gcloud auth application-default login --no-launch-browser
```

Verify your GCP account settings:

```bash
gcloud config get account
gcloud config get project
gcloud config get compute/region
```

Set the environment:

```powershell
Set-Content -Encoding ascii secrets.ps1 @'
$env:PULUMI_SKIP_UPDATE_CHECK = 'true'
$env:PULUMI_BACKEND_URL = "file://$($PWD -replace '\\','/')" # NB pulumi will create the .pulumi sub-directory.
$env:PULUMI_CONFIG_PASSPHRASE = 'password'
'@
```

Proviosion:

```powershell
. .\secrets.ps1
pulumi login
pulumi whoami -v
pulumi config set google-native:project $(gcloud config get project)
pulumi config set google-native:region $(gcloud config get compute/region)
pulumi up
```

Destroy everything:

```powershell
pulumi destroy
```

# Reference

* https://www.pulumi.com/registry/packages/google-native/api-docs/provider/
