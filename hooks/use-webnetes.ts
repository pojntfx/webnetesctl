import getPublicIp from "public-ip";
import { useCallback, useEffect, useState } from "react";
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
import * as Nominatim from "nominatim-browser";
import { feature } from "@ideditor/country-coder";

export const useWebnetes = () => {
  // State
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

  const [nodePublicIPv6, setNodePublicIPv6] = useState<string>();

  const [nodeCoordinates, setNodeCoordinates] = useState<number[]>([0, 0]);
  const [nodeCoordinatesLoading, setNodeCoordinatesLoading] = useState(false);
  const [nodeAddress, setNodeAddress] = useState<string>();
  const [nodeFlag, setNodeFlag] = useState<string>();

  // Effects
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

  useEffect(() => {
    // Get the public IPv6 address
    getPublicIp
      .v6()
      .then((ip) => setNodePublicIPv6(ip))
      .catch((e) => console.log("could not get public IPv6", e));
  }, []);

  useEffect(() => {
    // Map an address to the user's coordinates
    Nominatim.reverseGeocode({
      lat: nodeCoordinates[0].toString(),
      lon: nodeCoordinates[1].toString(),
      addressdetails: true,
    }).then((res: any) => {
      if (res.address?.country_code) {
        const feat = feature(res.address?.country_code as string);

        if (feat) {
          unstable_batchedUpdates(() => {
            setNodeAddress(res.display_name);
            setNodeFlag(feat.properties.emojiFlag!);
          });
        }
      }
    });
  }, [nodeCoordinates]);

  const refreshNodeLocation = useCallback(() => {
    // Get a user's coordinates and set them
    setNodeCoordinatesLoading(true);

    typeof window !== "undefined" &&
      navigator.geolocation.getCurrentPosition(
        (position) => {
          unstable_batchedUpdates(() => {
            setNodeCoordinates([
              position.coords.latitude,
              position.coords.longitude,
            ]);
            setNodeCoordinatesLoading(false);
          });
        },
        (e) => {
          console.error(
            "could not get user location, falling back to [0, 0]",
            e
          );

          setNodeCoordinates([0, 0]);
          setNodeCoordinatesLoading(false);
        }
      );
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
      nodePublicIPv6,

      location: {
        refreshLocation: refreshNodeLocation,
        loading: nodeCoordinatesLoading,
        latitude: nodeCoordinates[0],
        longitude: nodeCoordinates[1],
        address: nodeAddress,
        flag: nodeFlag,
      },
    },
  };
};
