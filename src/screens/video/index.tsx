/**
 * 视频播放
 * https://docs.thewidlarzgroup.com/react-native-video-player/docs/api/methods
 */

import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRef } from "react";
import { TouchableOpacity } from "react-native";
import VideoPlayer, { type VideoPlayerRef } from 'react-native-video-player';

const VideoPlayScreen = () => {
    const route = useRoute();
    const themeColor = useThemeColors();
    const navigation = useNavigation();
    const playerRef = useRef<VideoPlayerRef>(null);

    return (
        <ThemedView style={{ flex: 1, backgroundColor: themeColor.background }}>
            <VideoPlayer
                ref={playerRef}
                //autoplay={true}
                endWithThumbnail={true}
                // endThumbnail如果不设置, 展示thumbnail设置的值 
                // endThumbnail={{
                //     uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
                // }}
                thumbnail={{
                    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
                }}
                source={{
                uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                }}
                onError={(e) => console.log(e)}
                showDuration={true}
            />
        </ThemedView>
    );
}

export default VideoPlayScreen;