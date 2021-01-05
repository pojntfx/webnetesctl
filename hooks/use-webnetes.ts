import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { IGraph } from "../components/pages/join";
import graphClusterData from "../data/cluster.json";
import graphNetworkData from "../data/network-local.json";
import graphResourcesData from "../data/resources-local.json";

export const useWebnetes = () => {
  const [clusterGraph, setClusterGraph] = useState<IGraph>();
  const [networkGraph, setNetworkGraph] = useState<IGraph>();
  const [resourceGraph, setResourceGraph] = useState<IGraph>();

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setClusterGraph(graphClusterData);
      setNetworkGraph(graphNetworkData);
      setResourceGraph(graphResourcesData);
    });
  }, []);

  return {
    graphs: {
      cluster: clusterGraph,
      network: networkGraph,
      resources: resourceGraph,
    },
  };
};
