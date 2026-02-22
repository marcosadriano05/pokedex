let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    deno
  ];
}
# let
#   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-25.05";
#   pkgs = import nixpkgs { config = {}; overlays = []; };
# in
# pkgs.mkShellNoCC {
#   packages = with pkgs; [
#     deno
#   ];
# }
