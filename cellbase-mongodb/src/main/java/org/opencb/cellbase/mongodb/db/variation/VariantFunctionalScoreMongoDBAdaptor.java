/*
 * Copyright 2015 OpenCB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.opencb.cellbase.mongodb.db.variation;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.QueryBuilder;
import org.opencb.biodata.models.variant.Variant;
import org.opencb.biodata.models.variant.avro.Score;
import org.opencb.cellbase.core.db.api.variation.VariantFunctionalScoreDBAdaptor;
import org.opencb.cellbase.mongodb.MongoDBCollectionConfiguration;
import org.opencb.cellbase.mongodb.db.MongoDBAdaptor;
import org.opencb.datastore.core.QueryOptions;
import org.opencb.datastore.core.QueryResult;
import org.opencb.datastore.mongodb.MongoDataStore;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by imedina on 16/11/15.
 */
public class VariantFunctionalScoreMongoDBAdaptor extends MongoDBAdaptor implements VariantFunctionalScoreDBAdaptor {

    private static final float DECIMAL_RESOLUTION = 1000f;

    public VariantFunctionalScoreMongoDBAdaptor(String species, String assembly, MongoDataStore mongoDataStore) {
        super(species, assembly, mongoDataStore);
        mongoDBCollection = mongoDataStore.getCollection("variation_functional_score");

        logger.debug("VariantFunctionalScoreMongoDBAdaptor: in 'constructor'");
    }


    @Override
    public QueryResult getByVariant(String chromosome, int position, String reference, String alternate, QueryOptions queryOptions) {
        String chunkId = getChunkIdPrefix(chromosome, position, MongoDBCollectionConfiguration.VARIATION_FUNCTIONAL_SCORE_CHUNK_SIZE);
        QueryBuilder builder = QueryBuilder.start("_chunkIds").is(chunkId)
                .and("chromosome").is(chromosome)
                .and("start").is(position)
                .and("alternate").is(alternate);

        QueryResult result = executeQuery(chromosome + "_" + position + "_" + reference + "_" + alternate,
                builder.get(), queryOptions, mongoDBCollection);

        int offset = position % MongoDBCollectionConfiguration.VARIATION_FUNCTIONAL_SCORE_CHUNK_SIZE;
        List<Score> scores = new ArrayList<>();
        for (Object object : result.getResult()) {
            System.out.println("object = " + object);
            BasicDBObject dbObject = (BasicDBObject) object;
            BasicDBList basicDBList = (BasicDBList) dbObject.get("values");
            Long l1 = (Long) basicDBList.get(offset);
            float value = 0f;
            switch (alternate.toLowerCase()) {
                case "a":
                    value = ((short) (l1 >> 48) - 10000) / DECIMAL_RESOLUTION;
                    break;
                case "c":
                    value = ((short) (l1 >> 32) - 10000) / DECIMAL_RESOLUTION;
                    break;
                case "g":
                    value = ((short) (l1 >> 16) - 10000) / DECIMAL_RESOLUTION;
                    break;
                case "t":
                    value = ((short) (l1 >> 0) - 10000) / DECIMAL_RESOLUTION;
                    break;
                default:
                    break;
            }
            scores.add(Score.newBuilder().setScore(value).setSource(dbObject.getString("source")).build());
        }

        result.setResult(scores);
        return result;
    }


    @Override
    public QueryResult getByVariant(Variant variant, QueryOptions queryOptions) {
        return null;
    }

    @Override
    public List<QueryResult> getAllByVariantList(List<Variant> variantList, QueryOptions queryOptions) {
        return null;
    }

}