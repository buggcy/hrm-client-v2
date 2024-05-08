import { ESLint } from 'eslint';
import { CustomActionFunction, NodePlopAPI } from 'plop';

const FILE_TYPES = [
  'page',
  'shared component',
  'service',
  'hook',
  'e2e',
] as const;

const lintFixAction: CustomActionFunction = async (_, config) => {
  try {
    if (!config) return 'No path config provided';
    const eslint = new ESLint({ fix: true });
    const results = await eslint.lintFiles([config.path]);
    await ESLint.outputFixes(results);
    return 'Lint fixed';
  } catch {
    return 'Error while fixing lint';
  }
};

export default function Plop(plop: NodePlopAPI) {
  plop.setActionType('lint:fix', lintFixAction);

  plop.setGenerator('component', {
    description: 'Add a new component',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'Please specify a file type',
        choices: FILE_TYPES,
      },
      {
        type: 'input',
        name: 'name',
        message: 'Please enter a name',
        validate: function (value: string) {
          if (/.+/.test(value.trim())) {
            return true;
          }
          return 'Name is required';
        },
      },
    ],
    actions: data => {
      if (!data) return [];

      const { type } = data as {
        type: (typeof FILE_TYPES)[number];
        name: string;
      };

      switch (type) {
        case 'page':
          return [
            {
              type: 'add',
              path: `src/app/{{dashCase name}}/page.tsx`,
              templateFile: 'plop/page/page.hbs',
            },
          ];
        case 'shared component':
          // eslint-disable-next-line no-case-declarations
          const folderName = 'src/components/{{properCase name}}';
          return [
            {
              type: 'add',
              path: `${folderName}/{{properCase name}}.tsx`,
              templateFile: 'plop/component/component.hbs',
            },
            {
              type: 'add',
              path: `${folderName}/index.tsx`,
              templateFile: 'plop/component/index.hbs',
            },
            {
              type: 'add',
              path: `${folderName}/types.ts`,
              templateFile: 'plop/component/types.hbs',
            },
            {
              type: 'add',
              path: `${folderName}/{{properCase name}}.test.tsx`,
              templateFile: 'plop/component/test.hbs',
            },
          ];
        case 'hook':
          return [
            {
              type: 'add',
              path: `src/hooks/{{camelCase name}}.ts`,
              templateFile: 'plop/hook/index.hbs',
            },
            {
              type: 'append',
              path: `src/hooks/index.ts`,
              template: `export { {{camelCase name}} } from './{{camelCase name}}';`,
            },
          ];
        case 'service':
          return [
            {
              type: 'add',
              path: `src/services/{{camelCase name}}.service.ts`,
              templateFile: 'plop/service/index.hbs',
            },
            {
              type: 'modify',
              path: `src/services/index.ts`,
              pattern: /\n$/,
              template: `export * from './{{camelCase name}}.service';`,
            },
            {
              type: 'lint:fix',
              path: `src/services/index.ts`,
            },
          ];
        case 'e2e':
          return [
            {
              type: 'add',
              path: `e2e/{{properCase name}}.e2e-spec.ts`,
              templateFile: 'plop/e2e/index.hbs',
            },
          ];
        default:
          return [];
      }
    },
  });
}
