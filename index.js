#!/usr/bin/env node

import {execSync} from 'child_process';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import gradient from 'gradient-string';
import ora from 'ora';
import cliProgress from 'cli-progress';
import simpleGit from "simple-git";

// 获取当前模块的目录
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
        validate: (input) => !input || /^[0-9a-f]{16}$/.test(input) || 'AppID 格式不正确!',
    },
    {
        type: 'input',
        name: 'apiUrl',
        message: '请输入后端 API 地址（https开头，留空则跳过）:',
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
const gradientText = gradient(['#12CD65', '#004C00', '#161616'])('Vue.js - Vite - Initializer 😘');
console.log(gradientText);

inquirer.prompt(questions).then(async (answers) => {
    const {projectName, isWeixin, createLogin, appId, apiUrl, createGit} = answers;
    const projectPath = path.join(process.cwd(), projectName);

    // 显示进度条
    const progressBar = new cliProgress.SingleBar({
        format: '创建项目进度 |' + gradient(['#12CD65', '#004C00', '#161616'])('={bar}=') + '| {percentage}%',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
    });

    // 开始进度条
    progressBar.start(100, 0);

    // 克隆模板目录到项目目录
    const git = simpleGit();

    // 创建一个新的 Git 仓库
    await git.init(projectPath);
    await git.sparseCheckoutInit();

    // 设置要克隆的路径
    await git.sparseCheckoutAdd('template/*');

    // 克隆仓库
    await git.clone('https://github.com/your-username/vant-template.git', projectPath, ['--depth', '1']);
    progressBar.update(50); // 更新进度

    // 进入项目目录并安装依赖
    process.chdir(projectPath);
    execSync('npm install', {stdio: 'inherit'});
    progressBar.update(80); // 更新进度

    // 生成配置文件
    if (isWeixin) {
        const configContent = `
export default {
  appId: '${appId}',
  apiUrl: '${apiUrl}',
};
        `;
        fs.writeFileSync(path.join(projectPath, 'src/config.js'), configContent.trim());
        console.log('已生成配置文件 src/config.js');

        // 如果选择创建登录界面，复制相应组件
        if (createLogin) {
            const loginComponentPath = path.join(__dirname, 'template/src/Login.vue');
            fs.copyFileSync(loginComponentPath, path.join(projectPath, 'src/Login.vue'));
            console.log('已创建登录组件 Login.vue');
        }
    }

    // 初始化 git 仓库
    if (createGit) {
        execSync('git init', {stdio: 'inherit'});
        console.log('创建 git 仓库...');
    }

    // 完成进度条
    progressBar.update(100); // 更新进度
    progressBar.stop();

    console.log(gradient('项目创建成功！'), ` 项目 ${projectName} 创建成功！`);
});
