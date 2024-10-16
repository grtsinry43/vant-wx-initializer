#!/usr/bin/env node

import {execSync} from 'child_process';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import gradient from 'gradient-string';
import readline from 'readline';
import simpleGit from 'simple-git';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const questions = [
    {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称:',
        validate: (input) => !!input || '项目名称不能为空!',
    },
    {
        type: 'confirm',
        name: 'isWeixin',
        message: '是否是微信网页项目?',
        default: false,
    },
    {
        type: 'confirm',
        name: 'createLogin',
        message: '是否创建登录界面?',
        when: (answers) => answers.isWeixin,
        default: true,
    },
    {
        type: 'input',
        name: 'appId',
        message: '请输入微信 AppID（留空则跳过）:',
        when: (answers) => answers.isWeixin,
        validate: (input) => !input || /^wx[a-fA-F0-9]{16}$/.test(input) || 'AppID 格式不正确!',
    },
    {
        type: 'input',
        name: 'apiUrl',
        message: '请输入回调 url 地址（https开头，留空则跳过）:',
        when: (answers) => answers.isWeixin,
        validate: (input) => !input || /^https?:\/\//.test(input) || 'API 地址格式不正确!',
    },
    {
        type: 'confirm',
        name: 'createGit',
        message: '是否创建 git 仓库?',
        default: true,
    },
];

// 显示渐变文本
const gradientText = gradient(['#12CD65', '#004C00', '#144100'])('Vant - Wx - Initializer 😘');
console.log(gradientText);

// 刷新进度条
const updateProgress = (percentage) => {
    readline.cursorTo(process.stdout, 0); // 移动光标到当前行的开头
    process.stdout.write(` 创建项目进度 |${'='.repeat(percentage / 2)}${' '.repeat(50 - percentage / 2)}| ${percentage}%`);
};

async function updateRoutes(projectPath, addLoginPage) {
    const routesPath = path.join(projectPath, 'src/router/routes.ts');
    let routesContent = `const routes = [\n    {\n        path: '/',\n        name: '首页',\n        component: () => import('../layout/BasicLayout.vue'),\n        meta: { icon: 'guide-o', hideInMenu: false },\n        children: [\n            {\n                path: '',\n                name: '首页',\n                component: () => import('@/views/HomeView.vue')\n}\n        ]\n    },\n    {\n        path: '/leaderboard',\n        name: '排行榜',\n        component: () => import('../layout/BasicLayout.vue'),\n        meta: { icon: 'bar-chart-o', hideInMenu: false },\n        children: [\n            {\n                path: '',\n                name: '排行榜',\n                component: () => import('@/views/leaderBoard/LeaderBoardView.vue')\n}\n        ]\n    },\n    {\n        path: '/user',\n        name: '我的',\n        component: () => import('../layout/BasicLayout.vue'),\n        meta: { icon: 'user-o', hideInMenu: false },\n        children: [\n            {\n                path: '',\n                name: '我的',\n                component: () => import('@/views/user/UserView.vue')\n},\n            {\n                path: 'profile',\n                name: '个人信息',\n                component: () => import('@/views/user/UserInfoView.vue')\n}\n        ]\n    }`;

    // 如果选择添加登录页面，添加相应路由
    if (addLoginPage) {
        routesContent += `,\n    {\n        path: '/login',\n        name: '登录',\n        component: () => import('@/views/login/LoginView.vue'),\n        meta: { hideInMenu: true}\n    }`;
    }

    routesContent += '\n];\n\nexport default routes;';

    // 写入路由配置文件
    fs.writeFileSync(routesPath, routesContent, 'utf-8');
}

inquirer.prompt(questions).then(async (answers) => {
    const {projectName, isWeixin, createLogin, appId, apiUrl, createGit} = answers;
    const projectPath = path.join(process.cwd(), projectName);

    // 初始化进度条
    updateProgress(0); // 进度 0%

    // 克隆仓库
    const git = simpleGit();
    await git.clone('https://github.com/grtsinry43/vant-wx-initializer.git', projectPath, ['--depth', '1']);
    updateProgress(25); // 进度 25%

    // 删除不需要的文件和文件夹
    fs.readdirSync(projectPath).forEach(file => {
        if (file !== 'template') {
            fs.removeSync(path.join(projectPath, file));
        }
    });
    updateProgress(40); // 进度 40%

    // 移动 template 文件夹内容到项目根目录
    fs.copySync(path.join(projectPath, 'template'), projectPath);
    fs.removeSync(path.join(projectPath, 'template'));
    updateProgress(50); // 进度 50%

    // 读取并修改 package.json 文件
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath);
    packageJson.name = projectName; // 使用输入的项目名称
    fs.writeJsonSync(packageJsonPath, packageJson, {spaces: 2}); // 写回并格式化文件
    updateProgress(60); // 进度 60%

    // 打印日志信息，不覆盖进度条
    console.log(`\n 项目 ${projectName} 目录结构建立完成 `);

    // 切换到项目目录
    process.chdir(projectPath);

    // 安装依赖
    execSync('npm install', {stdio: 'inherit'});
    updateProgress(80); // 进度 80%

    // 生成配置文件
    if (isWeixin) {
        const configContent = `
export default {
  appId: '${appId}',
  redirectUrl: '${apiUrl}',
};
        `;
        fs.writeFileSync(path.join(projectPath, 'src/config.ts'), configContent.trim());
        console.log('\n已生成配置文件 src/config.ts');

        await updateRoutes(projectPath, createLogin);

        // 如果选择创建登录界面，复制相应组件
        if (createLogin) {
            const loginComponentPath = path.join(__dirname, 'template/LoginView.vue');
            fs.ensureDirSync(path.join(projectPath, 'src/views/login'));
            fs.copyFileSync(loginComponentPath, path.join(projectPath, 'src/views/login/LoginView.vue'));
            console.log('\n已创建登录组件 Login.vue');
        }

        // 删除 src/LoginView.vue 文件
        fs.removeSync(path.join(projectPath, 'src/LoginView.vue'));
        updateProgress(90); // 进度 90%
    }

    // 初始化 git 仓库
    if (createGit) {
        execSync('git init', {stdio: 'inherit'});
        console.log('\n创建 git 仓库...');
        updateProgress(95); // 进度 95%
    }

    // 完成进度条
    updateProgress(100); // 更新进度 100%
    console.log('\n'); // 为了避免覆盖进度条，先换行

    // 打印成功信息
    console.log(gradient(['#12CD65', '#004C00', '#144100'])('[success！]🎉'), ` 项目 ${projectName} 创建成功！`);
    console.log(gradient(['#12CD65', '#004C00', '#144100'])('[tips] 提示：'));
    console.log('> cd ' + projectName);
    console.log('> npm run dev');
    console.log('> npm run build');
});
