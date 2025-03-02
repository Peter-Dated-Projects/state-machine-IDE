export interface NodeInfo {
  name: string;
  id: string;
  inputs: string[]; // ids of other nodes
  outputs: string[]; // ids of other nodes
}

export const selectedNode: NodeInfo | null = null;
