import { fetchConfig } from 'gitignore.io';


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
        type: 'checkbox',
        name: 'stack_nature',
        message: 'Stack nature',
        choices: [
          { name: 'Bash (native)', value: 'bash', checked: true },
          { name: 'Node (Javascript)', value: 'node', disabled: true},
          { name: 'Python', value: 'python', disabled: true },
          { name: 'Docker', value: 'docker', disabled: true },
        ],
      },
      {
        type: 'confirm',
        name: 'wantPrecommit',
        message: 'Use pre-commit (preconfigured with linter for github-actions, markdown)?'
      },
      {
        type: 'confirm',
        name: 'wantGitignore',
        message: 'Generate a .gitignore automatically with .gitignore.io'
      }
    ],
    actions: function(data) {
      var actions = [];

      if(data.wantPrecommit){
        actions.push({
          type: 'add',
          path: 'gen/pre-commit-config.yml',
          templateFile: 'templates/pre-commit/pre-commit-config.yml'
        });
        actions.push({
          type: 'add',
          path: 'gen/.markdownlint.yml',
          templateFile: 'templates/pre-commit/.markdownlint.yml'
        });
        actions.push({
          type: 'add',
          path: 'gen/.github/workflows/pre-commit.yml',
          templateFile: 'templates/pre-commit/.github/workflows/pre-commit.yml'
        });
      }

      function generateGitIgnore(stack_nature) {
        const api = require('gitignore.io');
        var keywords = ['Windows', 'macOS', 'Linux'];

        if (stack_nature) {
          if (stack_nature.includes("node")) {
            keywords.push("Node");
          }
          if (stack_nature.includes("Python")) {
            keywords.push("Python");
          }
        }

        // keywords.push()
        return api.fetchConfig(keywords);
      }

      if(data.wantGitignore){
        actions.push({
          type: 'add',
          path: 'gen/.gitignore',
          templateFile: 'templates/.gitignore',
          // data: {
          //   "content": generateGitIgnore(data.stack_nature)
          // },
          transform: async function (template) {
            const keywords = ['Windows', 'macOS', 'Linux','Intellij+all', 'Eclipse', 'NetBeans', 'VisualStudioCode'];
            // const keywords = ['Windows', 'macOS', 'Linux', ...data.stack_nature];
            try {
              const gitignoreContent = await fetchConfig(keywords);
              return gitignoreContent;
            } catch (error) {
              console.error('Error generating .gitignore:', error);
              return template;
            }
          },
          skipIfExists: true,
        });
      }

      actions.push({
        type: 'add',
        path: 'gen/action.yml',
        templateFile: 'templates/base/action.yml'
      });

      return actions;
    }
  });
};