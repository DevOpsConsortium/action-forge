export default function (plop) {
  // controller generator
  plop.setGenerator('github-action', {
    description: 'Generate a GitHub Action',
    prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Action name'
        },
      {
        type: 'input',
        name: 'description',
        message: 'Action description'
      },
      {
        type: 'confirm',
        name: 'usePrecommit',
        message: 'Use pre-commit (preconfigured with linter for github-actions, markdown)?'
      }
    ],
    actions: function(data) {
      var actions = [];

      if(data.usePrecommit){
        actions.push({
          type: 'add',
          path: 'gen/pre-commit-config.yml',
          templateFile: 'templates/pre-commit/pre-commit-config.yml'
        });
        actions.push({
          type: 'add',
          path: 'gen/.github/workflows/pre-commit.yml',
          templateFile: 'templates/pre-commit/.github/workflows/pre-commit.yml'
        });
      }

      actions.push({
        type: 'add',
        path: 'gen/action.yml',
        templateFile: 'templates/base/action.yml'
      });

      return actions;
        // {
        //   type: 'addMany',
        //   destination: 'gen/',
        //   templateFiles: 'templates/**'
        // },
    }
  });
};