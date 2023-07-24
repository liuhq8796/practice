// 在 Node 环境中实现从 vue 的 GitHub 仓库中获取最近10个 issue 列表

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseUrl = "https://api.github.com/repos/vuejs/vue/issues";

axios
  .get(baseUrl, {
    params: {
      state: "all",
      sort: "created",
      direction: "desc",
      per_page: 10,
    },
  })
  .then((res) => {
    const issues = res.data.map((issue) => {
      return {
        title: issue.title,
        url: issue.html_url,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        labels: issue.labels.map((label) => label.name),
      };
    });
    fs.writeFileSync(
      path.resolve(__dirname, "./issues.json"),
      JSON.stringify(issues, null, 2),
      "utf-8"
    );
  })
  .catch((err) => {
    console.log(err);
  });
