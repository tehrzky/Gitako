import { GitBranchIcon } from '@primer/octicons-react'
import { Box, BranchName, Breadcrumbs, Text } from '@primer/react'
import { RepoContext } from 'containers/RepoContext'
import { platform } from 'platforms'
import React, { useContext, useEffect, useState } from 'react'
import { createAnchorClickHandler } from 'utils/createAnchorClickHandler'

export function MetaBar() {
  const metaData = useContext(RepoContext)
  if (!metaData) return null

  const { userName, repoName, branchName } = metaData
  const [branches, setBranches] = useState<string[]>([])

  useEffect(() => {
    if (!metaData) return
    platform.getBranches({ userName, repoName }).then(list => {
      setBranches(list.map(b => b.name))
    })
  }, [userName, repoName])
  
  const { repoUrl, userUrl, branchUrl } = platform.resolveUrlFromMetaData(metaData)
  
  return (
    <>
      <Breadcrumbs className={'user-and-repo'}>
        <Breadcrumbs.Item className={'user-name'} href={userUrl}>
          {userName}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item
          className={'repo-name'}
          href={repoUrl}
          onClick={createAnchorClickHandler(repoUrl)}
          {...platform.delegateFastRedirectAnchorProps?.()}
        >
          <Text fontWeight="bolder">{repoName}</Text>
        </Breadcrumbs.Item>
      </Breadcrumbs>
      <Box display="flex" paddingTop={1} flexWrap="nowrap" alignItems="flex-start">
        <div className={'octicon-wrapper'}>
          <GitBranchIcon size="small" />
        </div>
        <select
          value={branchName || ''}
          onChange={e => {
            const newBranch = e.target.value
            // Go to the new branch (starts at root folder)
            window.location.href = `${window.location.origin}/${userName}/${repoName}/tree/${newBranch}`
          }}
          style={{
            background: 'transparent',
            border: '1px solid #444',
            color: 'inherit',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            maxWidth: '100%',
          }}
        >
          {branches.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </Box>
    </>
  )
}
