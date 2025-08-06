type Soham901Config = {
  brand: {
    name: string;
  };
  backup: {
    github: { REPO_OWNER: string; REPO_NAME: string };
  };
};

const soham901Config: Soham901Config = {
  brand: {
    name: "Henmova",
  },
  backup: {
    github: { REPO_OWNER: "soham901", REPO_NAME: "henmova-site" },
  },
};

export default soham901Config as Soham901Config;
