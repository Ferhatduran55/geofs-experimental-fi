{pkgs, ...}: {
  channel = "stable-23.11";

  packages = [
    pkgs.nodejs_20
    pkgs.bun
  ];

  idx.extensions = [
    "bradlc.vscode-tailwindcss"
    "esbenp.prettier-vscode"
  ];
  
  idx.workspace.onCreate = {
    bun-install = "bun install";
  };  
}