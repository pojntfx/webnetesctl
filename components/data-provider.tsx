import clusterGraph from "../data/cluster.json";
import clusterNodes from "../data/network-cluster.json";
import connections from "../data/network-connections.json";
import networkGraph from "../data/network-local.json";
import nodeResource, { nodeId } from "../data/node-config";
import clusterResources from "../data/resources-cluster.json";
import resourceGraph from "../data/resources-local.json";
import computeStats from "../data/stats-compute.json";
import networkingStats from "../data/stats-networking.json";
import { IClusterNode, IClusterResource, INodeScore } from "./pages/explorer";
import { IGraph } from "./pages/join";
import { IConnections } from "./pages/overview";

export interface IDataProviderProps {
  children: (props: {
    graphs: {
      cluster: IGraph;
      network: IGraph;
      resources: IGraph;
    };
    stats: {
      compute: INodeScore[];
      networking: INodeScore[];
    };
    cluster: {
      connections: IConnections;
      nodes: IClusterNode[];
      resources: IClusterResource[];
    };
    local: {
      nodeConfig: string;
      setNodeConfig: (newNodeConfig: string) => void;
      nodeId: string;
    };
  }) => React.ReactNode;
}

export const DataProvider: React.FC<IDataProviderProps> = ({
  children,
  ...otherProps
}) => {
  return (
    <>
      {children({
        graphs: {
          cluster: clusterGraph,
          network: networkGraph,
          resources: resourceGraph,
        },
        stats: {
          compute: computeStats,
          networking: networkingStats,
        },
        cluster: {
          connections: connections,
          nodes: clusterNodes,
          resources: clusterResources,
        },
        local: {
          nodeConfig: nodeResource,
          nodeId,
        },
        ...otherProps,
      })}
    </>
  );
};
