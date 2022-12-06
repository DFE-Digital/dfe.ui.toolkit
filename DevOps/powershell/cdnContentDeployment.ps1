
#[CmdletBinding()]
#param (
 #   [Parameter(Mandatory = $true)]
  #  [string]
   # $ServiceConnection
      
#)

#Empty Storage Container Contents
$publicIp = Invoke-RestMethod -uri https://api.ipify.org

Write-Host $publicIp
az storage account network-rule add -g 's141d01-shd' --account-name 's141d01signinshdstr' --ip-address $publicIp

Start-Sleep 180

az storage blob upload-batch --account-name 's141d01signinshdstr' --source 'ui-assets-test' --SourcePath $Env:AGENT_WORKFOLDER


#Copy Content to Storage Account Container
#$(CdnSourcesFiles) -- Source
#$(StorageAccountName)/$(UIContainerName)

#Set Container Public Access Level to Blob (Public)
#Get-AzureRmStorageAccount -ResourceGroupName $(ShdResourceGroupName) -Name $(StorageAccountName) | Set-AzureStorageContainerAcl -Name $(UIContainerName) -Permission Blob

#Purge CDN Content
#Get-AzureRmCdnEndpoint -ResourceGroupName $(ShdResourceGroupName) -ProfileName $(azureCdnName) -EndpointName $(cdnEndpointName) | Unpublish-AzureRmCdnEndpointContent -PurgeContent '/*'

#Remove agent IP address from Storage Account
#az storage account network-rule remove -g $(ShdResourceGroupName) --account-name $(StorageAccountName) --ip-address $(agentIp)
az storage account network-rule remove -g 's141d01-shd' --account-name 's141d01signinshdstr' --ip-address $publicIp

#Read Secrets: 
#s141d01-shd/s141d01-signin-kv/cdnAssetsVersion

#Set var newCdnAssetsVersion
#$cdnAssetsVersion = [decimal]$(cdnAssetsVersion)
#$newCdnAssetsVersion = $cdnAssetsVersion+0.1
#Write-Host "##vso[task.setvariable variable=newCdnAssetsVersion;]$newCdnAssetsVersion"

#Write Secrets: cdnAssetsVersion
#var s141d01-signin-kv/cdnAssetsVersion
#value $newCdnAssetsVersion