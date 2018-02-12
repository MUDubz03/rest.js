const GitHub = require('../../')

describe('api.github.com', () => {
  it('github.repos.createStatus()', () => {
    const github = new GitHub({
      protocol: 'http',
      host: 'localhost:3000'
    })
    github.plugin(require('../../lib/plugins/authentication'))
    github.plugin(require('../../lib/plugins/endpoint-methods'))

    github.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000001'
    })

    return Promise.all([
      github.repos.createStatus({
        owner: 'octokit-fixture-org',
        repo: 'create-status',
        sha: '0000000000000000000000000000000000000001',
        state: 'failure',
        target_url: 'https://example.com',
        description: 'create-status failure test',
        context: 'example/1'
      }),
      github.repos.createStatus({
        owner: 'octokit-fixture-org',
        repo: 'create-status',
        sha: '0000000000000000000000000000000000000001',
        state: 'success',
        target_url: 'https://example.com',
        description: 'create-status success test',
        context: 'example/2'
      })
    ])

    .then(() => {
      return github.repos.getStatuses({
        owner: 'octokit-fixture-org',
        repo: 'create-status',
        ref: '0000000000000000000000000000000000000001'
      })
    })

    .then((response) => {
      expect(response.data.length).to.equal(2)

      return github.repos.getCombinedStatusForRef({
        owner: 'octokit-fixture-org',
        repo: 'create-status',
        ref: '0000000000000000000000000000000000000001'
      })
    })
    .then((response) => {
      expect(response.data.state).to.equal('failure')
    })
  })
})