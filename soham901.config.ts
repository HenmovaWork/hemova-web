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
    github: { REPO_OWNER: "HenmovaWork", REPO_NAME: "hemova-web" },
  },
};

export default soham901Config as Soham901Config;
