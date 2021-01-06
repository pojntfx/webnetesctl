import { feature } from "@ideditor/country-coder";
import * as Nominatim from "nominatim-browser";
import getPublicIp from "public-ip";
import { useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import graphClusterData from "../data/cluster.json";
import clusterNodesData from "../data/network-cluster.json";
import clusterConnectionsData from "../data/network-connections.json";
import graphNetworkData from "../data/network-local.json";
import nodeConfigData, { nodeId as nodeIdData } from "../data/node-config";
import clusterResourcesData from "../data/resources-cluster.json";
import statsComputeData from "../data/stats-compute.json";
import statsNetworkingData from "../data/stats-networking.json";

export interface IConnections {
  management: number[][][];
  application: number[][][];
}

export interface IGraph {
  nodes: { id: string; group: number }[];
  links: {
    source: string;
    target: string;
    value: number;
  }[];
}

export interface IClusterNode {
  privateIP: string;
  publicIP: string;
  location: string;
  latitude: number;
  longitude: number;
  size: number;
}

export interface IClusterResource {
  kind: string;
  name: string;
  label: string;
  node: string;
  src: string;
}

export interface INodeScore {
  ip: string;
  score: number;
}

export const useWebnetes = () => {
  // Hooks
  const { t } = useTranslation();

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

  const [log, setLog] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    unstable_batchedUpdates(() => {
      setClusterGraph(graphClusterData);
      setNetworkGraph(graphNetworkData);

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
    if (clusterResources && nodeId) {
      const nodeGID = 0;

      // Parse serialized resources
      const resources = clusterResources
        .filter((resource) => resource.node === nodeId)
        .map((resource) => JSON.parse(JSON.parse(resource.src)));

      // Group by kinds
      const kinds = new Map<string, { gid: number; items: string[] }>();
      kinds.set("Node", { gid: nodeGID, items: [nodeId] });
      resources.forEach((resource) => {
        !kinds.has(resource.kind) &&
          kinds.set(resource.kind, { gid: kinds.size, items: [] });

        kinds.get(resource.kind)!.items.push(resource.metadata.label); // We set abolve
      });

      // Collect to nodes
      const nodes: any[] = [];
      kinds.forEach((res, kind) =>
        res.items.forEach((label) =>
          nodes.push({ group: res.gid, id: `${kind}/${label}` })
        )
      );

      // Connect everything but the root node itself to the root node
      const links: any[] = [];
      nodes.forEach(
        (node) =>
          node.group !== nodeGID && // Don't connect nodes to each other
          nodes
            .filter((candidate) => candidate.group === nodeGID)
            .forEach((nodeResource) =>
              links.push({
                source: nodeResource.id,
                target: node.id,
                value: 1,
              })
            )
      );

      setResourceGraph({ nodes, links });
    }
  }, [clusterResources, nodeId]);

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

  const appendToLog = useCallback(
    (msg) => {
      setLog((oldLog) => [
        ...oldLog,
        `${new Date().toLocaleTimeString()}: ${msg}`,
      ]);
    },
    [log]
  );

  const refreshNodeLocation = useCallback(() => {
    // Get a user's coordinates and set them
    setNodeCoordinatesLoading(true);
    appendToLog(t("requestedLocation"));

    typeof window !== "undefined" &&
      navigator.geolocation.getCurrentPosition(
        (position) => {
          unstable_batchedUpdates(() => {
            setNodeCoordinates([
              position.coords.latitude,
              position.coords.longitude,
            ]);
            setNodeCoordinatesLoading(false);
            appendToLog(t("resolvedLocation"));
          });
        },
        (e) => {
          console.error(
            "could not get user location, falling back to [0, 0]",
            e
          );

          setNodeCoordinates([0, 0]);
          setNodeCoordinatesLoading(false);
          appendToLog(t("deniedLocationAccess"));
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
    log,
  };
};
