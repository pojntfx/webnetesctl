import clusterNodesData from "../data/network-cluster.json";
import clusterConnectionsData from "../data/network-connections.json";
import nodeConfigData, { nodeId as nodeIdData } from "../data/node-config";
import clusterResourcesData from "../data/resources-cluster.json";
import statsComputeData from "../data/stats-compute.json";
import statsNetworkingData from "../data/stats-networking.json";
import { IClusterNode, IClusterResource, INodeScore } from "./pages/explorer";
import { IConnections } from "./pages/overview";

export interface IDataProviderProps {
  children: (props: {
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
        stats: {
          compute: statsComputeData,
          networking: statsNetworkingData,
        },
        cluster: {
          connections: clusterConnectionsData,
          nodes: clusterNodesData,
          resources: clusterResourcesData,
        },
        local: {
          nodeConfig: nodeConfigData,
          nodeId: nodeIdData,
        },
        ...otherProps,
      })}
    </>
  );
};
