package com.nguyenvanninh.chat.repository.custom;

import com.nguyenvanninh.chat.entity.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MessageRepositoryCustom {

    MongoTemplate mongoTemplate;

    public List<Message> findLatestMessagesPerRoom(int page, int pageSize) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "timestamp")),
                Aggregation.group("roomId").first(Aggregation.ROOT).as("latestMessage"),
                Aggregation.replaceRoot("latestMessage"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "timestamp")),
                Aggregation.skip((long) page * pageSize),
                Aggregation.limit(pageSize)
        );

        AggregationResults<Message> results = mongoTemplate.aggregate(
                aggregation, "messages", Message.class
        );

        return results.getMappedResults();
    }
}
