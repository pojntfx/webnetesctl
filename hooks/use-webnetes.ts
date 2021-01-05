import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import {
  IClusterNode,
  IClusterResource,
  INodeScore,
} from "../components/pages/explorer";
import { IGraph } from "../components/pages/join";
import { IConnections } from "../components/pages/overview";
import graphClusterData from "../data/cluster.json";
import clusterNodesData from "../data/network-cluster.json";
import clusterConnectionsData from "../data/network-connections.json";
import graphNetworkData from "../data/network-local.json";
import nodeConfigData, { nodeId as nodeIdData } from "../data/node-config";
import clusterResourcesData from "../data/resources-cluster.json";
import graphResourcesData from "../data/resources-local.json";
import statsComputeData from "../data/stats-compute.json";
import statsNetworkingData from "../data/stats-networking.json";

export const useWebnetes = () => {
  const [clusterGraph, setClusterGraph] = useState<IGraph>();
  const [networkGraph, setNetworkGraph] = useState<IGraph>();
  const [resourceGraph, setResourceGraph] = useState<IGraph>();

  const [computeStats, setComputeStats] = useState<INodeScore[]>();
  const [networkingStats, setNetworkingStats] = useState<INodeScore[]>();

  const [clusterConnections, setClusterConnections] = useState<IConnections>();
  const [clusterNodes, setClusterNodes] = useState<IClusterNode[]>();
  const [clusterResources, setClusterResources] = useState<
    IClusterResource[]
  >();

  const [nodeConfig, setNodeConfig] = useState<string>();
  const [nodeId, setNodeId] = useState<string>();

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setClusterGraph(graphClusterData);
      setNetworkGraph(graphNetworkData);
      setResourceGraph(graphResourcesData);

      setComputeStats(statsComputeData);
      setNetworkingStats(statsNetworkingData);

      setClusterConnections(clusterConnectionsData);
      setClusterNodes(clusterNodesData);
      setClusterResources(clusterResourcesData);

      setNodeConfig(nodeConfigData);
      setNodeId(nodeIdData);
    });
  }, []);

  return {
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
      connections: clusterConnections,
      nodes: clusterNodes,
      resources: clusterResources,
    },
    local: {
      nodeConfig,
      setNodeConfig,
      nodeId,
    },
  };
};
