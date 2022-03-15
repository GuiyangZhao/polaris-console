import * as React from 'react'
import { purify, DuckCmpProps } from 'saga-duck'
import { Table, Justify, Segment, SearchBox } from 'tea-component'
import { Link } from 'react-router-dom'

import Duck from './UseableResourceFetcher'
import { autotip } from 'tea-component/lib/table/addons'

const ResourceOptions = [
  { text: '命名空间', value: 'namespaces' },
  { text: '服务', value: 'services' },
]

export default purify(function(props: DuckCmpProps<Duck>) {
  const { duck, store } = props
  const { selectors } = duck
  const [filterResourceType, setFilterResourceType] = React.useState('namespaces')
  const [keyword, setKeyword] = React.useState('')
  const resources = selectors.data(store)?.resources || { namespaces: [], services: [] }
  return (
    <>
      <Table.ActionPanel>
        <Justify
          left={
            <Segment
              value={filterResourceType}
              options={ResourceOptions}
              onChange={v => setFilterResourceType(v)}
            ></Segment>
          }
          right={<SearchBox value={keyword} onChange={v => setKeyword(v)} />}
        ></Justify>
      </Table.ActionPanel>
      <Table
        bordered
        recordKey={'id'}
        records={resources[filterResourceType]?.filter(item =>
          item.name === '*' ? true : item?.name?.indexOf(keyword) > -1,
        )}
        columns={[
          {
            key: 'name',
            header: '名称',
            render: (x: any) => {
              if (x.name === '*') {
                return filterResourceType === 'namespaces' ? '所有命名空间' : '所有服务'
              }
              return filterResourceType === 'namespaces' ? (
                x.name
              ) : (
                <Link to={`/service-detail?name=${x.name}&namespace=${x.namespace}`}>{x.name}</Link>
              )
            },
          },
          {
            key: 'auth',
            header: '权限',
            render: () => {
              return '读｜写'
            },
          },
        ]}
        addons={[autotip({})]}
      ></Table>
    </>
  )
})
